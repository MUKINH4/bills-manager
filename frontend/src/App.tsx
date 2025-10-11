import { Route, Routes } from 'react-router-dom'
import './App.css'
import SideBar from './components/SideBar'
import type { SideBar as SideBarType } from './types/SideBar'
import Dashboard from './pages/Dashboard'
import AddBill from './pages/AddBill'

let items: SideBarType[] = [
  {
    link: "/dashboard", name: "Dashboard"
  },
  {
    link: "/bills", name: "Contas"
  },
  {
    link: "/bills/add", name: "Adicionar Conta"
  },
]


function App() {

  return (
    <div className="flex">
      <SideBar items={items} />

      <main className="flex-1">
        <Routes>
          <Route index path='/dashboard' element={<Dashboard />} />
          <Route index path='/bills/add' element={<AddBill />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
