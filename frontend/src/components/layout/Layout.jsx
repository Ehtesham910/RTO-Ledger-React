import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function Layout(){
    return (
        <div>
            <Navbar />
            <Sidebar />
            <main style={{marginLeft: '260px', marginTop: '72px', padding: '24px'}}>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;
