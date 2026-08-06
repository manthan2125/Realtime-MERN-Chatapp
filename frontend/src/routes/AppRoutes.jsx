import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "../screens/Login.jsx"
import Register from "../screens/Register.jsx"
import Home from "../screens/Home.jsx"

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
