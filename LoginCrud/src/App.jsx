import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login.jsx'
import Users from './Users.jsx'
import UpdateUser from './UpadateUser.jsx'

function App() {


  return (
    <BrowserRouter>
     <Routes>
      <Route path="/" element= {<Signup />} />
      <Route path="/login" element= {<Login />} />
      <Route path="/home" element= {<Users /> } />
      <Route path="/update" element= {<UpdateUser />} />
      <Route path="*" element= {<h1> 404 Not Found </h1>} />
     </Routes>
    </BrowserRouter>
    
  )
}

export default App
