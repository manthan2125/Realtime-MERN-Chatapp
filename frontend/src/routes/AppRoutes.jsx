import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "../screens/Login.jsx"
import Register from "../screens/Register.jsx"
import Home from "../screens/Home.jsx"
import Project from '../screens/Project.jsx'
import UserAuth from '../auth/UserAuth.jsx'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<UserAuth><Home /></UserAuth>} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/project' element={<UserAuth><Project /></UserAuth>} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
