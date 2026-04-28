import { Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'

export default function Layout() {
  return (
    <div className="flex h-full bg-navy-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
