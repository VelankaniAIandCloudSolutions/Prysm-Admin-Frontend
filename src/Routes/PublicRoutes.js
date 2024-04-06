import React from 'react';

import { Navigate, Outlet } from 'react-router-dom'

const useAuth = () => {
    const user = sessionStorage.getItem('user')
    if (user !== null) {
        return true
    } else {
        return false
    }
}

const PublicRoutes = (props) => {

    const auth = useAuth()

    return auth ? (<>
        <Navigate to="/admin/Home" /> </>) : (<>
            <Outlet /></>)
}

export default PublicRoutes;