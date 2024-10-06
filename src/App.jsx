import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import Home from './Pages/Home'
import "./style.scss"
import LoadingPage from './Pages/LoadingPage'

function App() {

  const { currentUser } = useContext(AuthContext)
  // console.log(currentUser);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children
  }

  return (
    <>
    
      <BrowserRouter>
        <Routes>
          <Route index 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
          <Route path='/register' element={<Signup />} />
          <Route path='/login' element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
