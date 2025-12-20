import React, { useEffect } from "react";
import {Outlet} from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch } from 'react-redux';
import { login } from '../redux/featuresRedux/userSlice';

function Layout(){
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            dispatch(login(JSON.parse(userData)));
        }
    }, [dispatch]);

    return(
        <>
            <Navbar/>
            <Outlet />
            <Footer/>
        </>
    )
}

export default Layout;
