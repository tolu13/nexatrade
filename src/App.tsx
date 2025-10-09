
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { LoginPage } from './pages/login'
import { ToastContainer } from 'react-toastify'
import { DashBoardLayout } from './pages/dashboard'
import { DashboardHome } from './pages/dashboard/Home'
import { Market } from './pages/market'
import { Transactions } from './pages/transacions'
import { PrivateRoute } from './components/protected_route'
import Earn from './pages/earn'

function App() {


  return (
    <>
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Route with nested routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashBoardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="earn" element={<Earn />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="market" element={<Market />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
