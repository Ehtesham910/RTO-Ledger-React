import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/roles.css';

function PortalSearch() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState({
        vehicles: [],
        serviceRequests: [],
        receipts: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!query) {
            setLoading(false);
            return;
        }

        setLoading(true);
        axios.get(`http://localhost:5000/api/portal/search?q=${encodeURIComponent(query)}`)
            .then(res => {
                setResults(res.data);
            })
            .catch(err => console.error("Search error:", err))
            .finally(() => setLoading(false));
    }, [query]);

    if (loading) {
        return <div className="page-container"><div className="loading-state">Searching for "{query}"...</div></div>;
    }

    if (!query) {
        return <div className="page-container"><div className="empty-state">Please enter a search term.</div></div>;
    }

    const totalResults = results.vehicles.length + results.serviceRequests.length + results.receipts.length;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">My Search Results for "{query}"</h2>
                    <p className="page-subtitle">Found {totalResults} result(s) in your account</p>
                </div>
            </div>

            {totalResults === 0 && (
                <div className="card empty-state">No matching records found.</div>
            )}

            {results.vehicles.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Vehicles ({results.vehicles.length})</h3>
                    <div className="card table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Vehicle No.</th>
                                    <th>Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.vehicles.map(v => (
                                    <tr key={v.id}>
                                        <td><span className="badge">{v.vehicle_number}</span></td>
                                        <td>{v.vehicle_type}</td>
                                        <td>
                                            <button className="btn-action view" onClick={() => navigate('/portal/vehicles')}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {results.serviceRequests.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Service Requests ({results.serviceRequests.length})</h3>
                    <div className="card table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Request No.</th>
                                    <th>Vehicle</th>
                                    <th>Service</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.serviceRequests.map(r => (
                                    <tr key={r.id}>
                                        <td><span className="badge">{r.request_no}</span></td>
                                        <td>{r.vehicles?.vehicle_number || '-'}</td>
                                        <td>{r.services?.service_name || '-'}</td>
                                        <td>
                                            <button className="btn-action view" onClick={() => navigate('/portal/service-requests')}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {results.receipts.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Receipts ({results.receipts.length})</h3>
                    <div className="card table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Receipt No.</th>
                                    <th>Vehicle</th>
                                    <th>Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.receipts.map(r => (
                                    <tr key={r.id}>
                                        <td><span className="badge">{r.receipt_no}</span></td>
                                        <td>{r.ledgers?.vehicles?.vehicle_number || '-'}</td>
                                        <td>₹{r.amount_received}</td>
                                        <td>
                                            <button className="btn-action view" onClick={() => navigate(`/portal/receipts/${r.id}`)}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PortalSearch;
