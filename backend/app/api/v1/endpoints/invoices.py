import uuid
from io import BytesIO
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors

from app.api.dependencies import get_db, get_mongo_db, require_manager_or_above
from app.models.employee import Employee
from app.repositories.vehicle_repository import vehicle_repository
from app.repositories.employee_repository import employee_repository
from app.repositories.wash_type_repository import wash_type_repository
from app.repositories.transaction_repository import transaction_repository

router = APIRouter()


def _format_time_12h(dt: datetime) -> str:
    """Format datetime as HH:MM AM/PM"""
    return dt.strftime("%I:%M %p")


def _format_date(dt: datetime) -> str:
    """Format datetime as DD/MM/YYYY"""
    return dt.strftime("%d/%m/%Y")


def _generate_invoice_pdf(
    vehicle: dict,
    employee_name: str,
    wash_type_name: str,
    total_amount: float,
) -> bytes:
    """Generate PDF invoice using reportlab"""

    buffer = BytesIO()
    page_width, page_height = letter

    # Create canvas
    c = canvas.Canvas(buffer, pagesize=letter)

    # Set font
    c.setFont("Helvetica-Bold", 14)

    # Header
    c.drawString(1.2 * inch, page_height - 0.8 * inch, "🚗 LAVADERO")
    c.setFont("Helvetica", 10)
    c.drawString(1.2 * inch, page_height - 1.1 * inch, "Factura de Servicio")

    # Divider
    c.setStrokeColorRGB(0.2, 0.2, 0.2)
    c.setLineWidth(1)
    c.line(0.8 * inch, page_height - 1.3 * inch, 7.2 * inch, page_height - 1.3 * inch)

    # Invoice number and date
    invoice_number = datetime.now().strftime("%Y%m%d%H%M%S")
    c.setFont("Helvetica", 10)
    y = page_height - 1.7 * inch
    c.drawString(1.2 * inch, y, f"Factura #: {invoice_number}")
    c.drawString(5.0 * inch, y, f"Fecha: {_format_date(vehicle['entry_timestamp'])}")

    # Client section
    y -= 0.5 * inch
    c.setFont("Helvetica-Bold", 10)
    c.drawString(1.2 * inch, y, "── DATOS DEL CLIENTE ──")

    y -= 0.25 * inch
    c.setFont("Helvetica", 10)
    c.drawString(1.2 * inch, y, f"Nombre: {vehicle['customer_name']}")

    if vehicle.get('customer_phone'):
        y -= 0.2 * inch
        c.drawString(1.2 * inch, y, f"Teléfono: {vehicle['customer_phone']}")

    # Vehicle section
    y -= 0.4 * inch
    c.setFont("Helvetica-Bold", 10)
    c.drawString(1.2 * inch, y, "── VEHÍCULO ──")

    y -= 0.25 * inch
    c.setFont("Helvetica", 10)
    c.drawString(1.2 * inch, y, f"Placa: {vehicle['plate']}")

    y -= 0.2 * inch
    entry_time = _format_time_12h(vehicle['entry_timestamp'])
    c.drawString(1.2 * inch, y, f"Hora entrada: {entry_time}")

    y -= 0.2 * inch
    exit_time = _format_time_12h(vehicle['exit_timestamp'])
    c.drawString(1.2 * inch, y, f"Hora salida: {exit_time}")

    # Service section
    y -= 0.4 * inch
    c.setFont("Helvetica-Bold", 10)
    c.drawString(1.2 * inch, y, "── SERVICIO ──")

    y -= 0.25 * inch
    c.setFont("Helvetica", 10)
    c.drawString(1.2 * inch, y, f"Empleado: {employee_name}")

    y -= 0.2 * inch
    c.drawString(1.2 * inch, y, f"Tipo de lavado: {wash_type_name}")

    # Total section
    y -= 0.6 * inch
    c.setStrokeColorRGB(0.2, 0.2, 0.2)
    c.setLineWidth(1)
    c.line(0.8 * inch, y + 0.1 * inch, 7.2 * inch, y + 0.1 * inch)

    c.setFont("Helvetica-Bold", 12)
    c.drawString(4.5 * inch, y - 0.25 * inch, f"TOTAL: ${total_amount:.2f}")

    c.showPage()
    c.save()

    buffer.seek(0)
    return buffer.getvalue()


@router.get("/vehicle/{vehicle_id}")
async def get_invoice(
    vehicle_id: str,
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    _: Employee = Depends(require_manager_or_above),
):
    """Generate and download invoice PDF for a vehicle"""
    try:
        # Get vehicle from MongoDB
        vehicle = await vehicle_repository.get(mongo_db, vehicle_id)
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehículo no encontrado")

        # Validate vehicle has completed exit
        if vehicle.get("status") != "completed":
            raise HTTPException(
                status_code=400,
                detail="El vehículo aún no ha registrado salida"
            )

        if not vehicle.get("exit_timestamp"):
            raise HTTPException(
                status_code=400,
                detail="El vehículo no tiene timestamp de salida"
            )

        # Get employee name
        employee_id = vehicle.get("assigned_employee_id")
        if not employee_id:
            raise HTTPException(status_code=400, detail="Vehículo sin empleado asignado")

        employee = await employee_repository.get(db, uuid.UUID(employee_id))
        if not employee:
            raise HTTPException(status_code=404, detail="Empleado no encontrado")

        # Get wash type details
        wash_type_id = vehicle.get("wash_type_id")
        if not wash_type_id:
            raise HTTPException(status_code=400, detail="Vehículo sin tipo de lavado")

        wash_type = await wash_type_repository.get(db, uuid.UUID(wash_type_id))
        if not wash_type:
            raise HTTPException(status_code=404, detail="Tipo de lavado no encontrado")

        # Get transaction to get final amount (should match wash_type.price)
        transactions = await transaction_repository.get_by_vehicle(db, vehicle_id)
        if not transactions:
            # Fallback to wash type price if no transaction found (shouldn't happen)
            total_amount = wash_type.price
        else:
            total_amount = transactions[0].amount

        # Generate PDF
        pdf_bytes = _generate_invoice_pdf(
            vehicle=vehicle,
            employee_name=employee.name,
            wash_type_name=wash_type.name,
            total_amount=total_amount,
        )

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'inline; filename="factura-{vehicle["plate"]}.pdf"'}
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando factura: {str(e)}")
