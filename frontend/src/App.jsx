// import React from 'react';
// import Navbar from './components/layout/Navbar';
// import Sidebar from './components/layout/Sidebar'; // Aapne ye import kiya hai
// import VehicleCard from './components/cards/VehicleCard';

// function App() {
//     return (
//         <div>
//             <Navbar />
            
//             {/* Navbar ke theek neeche Sidebar add karein */}
//             <Sidebar />
            
//             {/* Note: Sidebar left me fix rahega, isliye main content ko thoda right push karna padta hai */}
//             <main style={{ padding: '20px', textAlign: 'center', marginLeft: '260px', marginTop: '72px' }}>
//                 <h2>Welcome to RTO ledger!</h2>
//                 <p>The best platform for vehicle challan management.</p>

//                 <div style={{ display: 'flex', justifyContent: 'center' }}>
//                     <VehicleCard
//                         ownerName="Rahul Sharma"
//                         vehicleNumber="MH 12 AB 1234"
//                         status="Active"
//                     />
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* / path par Layout ke andar Dashboard load hoga */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    
                    {/* Baad me hum yahan Customers aur Vehicles pages bhi add karenge */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

