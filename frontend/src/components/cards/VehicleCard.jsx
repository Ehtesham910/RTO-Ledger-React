import React from 'react';

function VehicleCard(props) {
    return (
        <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px', borderRadius: '8px' }}>
            <h3>Owner: {props.ownerName}</h3>
            <p><strong>Vehicle No.:</strong>{props.vehicleNumber}</p>
            <p><strong>Status:</strong>{props.status}</p>
        </div>
    );
}

export default VehicleCard;