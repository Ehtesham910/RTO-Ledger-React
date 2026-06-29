import React from 'react';
import VehicleCard from '../components/cards/VehicleCard';

function Dashboard() {
    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Welcome to RTO ledger!</h2>
            <p>The best platform for vehicle challan management.</p>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <VehicleCard
                    ownerName="Rahul Sharma"
                    vehicleNumber="MH 12 AB 1234"
                    status="Active"
                />
            </div>
        </div>
    );
}

export default Dashboard;
