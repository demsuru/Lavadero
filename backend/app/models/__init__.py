# Import all models so SQLAlchemy registers them before create_all runs
from app.models.employee import Employee
from app.models.shift import Shift
from app.models.wash_type import WashType
from app.models.transaction import Transaction
