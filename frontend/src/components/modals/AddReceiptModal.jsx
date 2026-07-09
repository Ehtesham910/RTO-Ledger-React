import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/addCustomerModal.css';

const AddReceiptModal = ({ isOpen, onClose, onSave }) => {
    const [ledgers, setLedgers] = useState([]);
    const [selectedLedgerId, setSelectedLedgerId] = useState('');
    const [selectedLedger, setSelectedLedger] = useState(null);
    const [amountReceived, setAmountReceived] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [transactionReference, setTransactionReference] = useState('');
    const [remarks, setRemarks] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Fetch ledgers
            axios.get('http://localhost:5000/api/ledger')
                .then(res => {
                    // Filter ledgers where due_amount > 0
                    const pendingLedgers = res.data.filter(ledger => parseFloat(ledger.due_amount) > 0);
                    setLedgers(pendingLedgers);
                })
                .catch(err => console.error("Error fetching ledgers:", err));

            // Reset state
            setSelectedLedgerId('');
            setSelectedLedger(null);
            setAmountReceived('');
            setPaymentMode('Cash');
            setTransactionReference('');
            setRemarks('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleLedgerChange = (e) => {
        const id = e.target.value;
        setSelectedLedgerId(id);
        const ledger = ledgers.find(l => String(l.id) === String(id));
        setSelectedLedger(ledger);
        if (ledger) {
            setAmountReceived(ledger.due_amount);
        } else {
            setAmountReceived('');
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedLedgerId) {
            setError('Please select a ledger record.');
            return;
        }

        const amount = parseFloat(amountReceived);
        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        const maxDue = parseFloat(selectedLedger.due_amount);
        if (amount > maxDue) {
            setError(`Amount received cannot exceed the remaining due amount of ₹ ${maxDue}.`);
            return;
        }

        const payload = {
            ledger_id: selectedLedgerId,
            amount_received: amount,
            payment_mode: paymentMode,
            transaction_reference: transactionReference,
            remarks: remarks
        };

        try {
            const response = await axios.post('http://localhost:5000/api/receipts', payload);
            onSave(response.data);
        } catch (err) {
            console.error("Error creating receipt:", err);
            setError(err.response?.data?.error || 'Failed to create receipt.');
        }
    };

    const formatVehicleNumber = (vNum) => {
        if (!vNum) return '-';
        const clean = vNum.replace(/\s+/g, '').toUpperCase();
        const match = clean.match(/^([A-Z]{2})(\d{1,2})([A-Z]{1,3})?(\d{1,4})$/);
        if (match) {
            return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
        }
        return vNum;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h2>Create New Receipt</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', fontWeight: '500' }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group full-width" style={{ marginBottom: '15px' }}>
                        <label>Select Outstanding Ledger Record <span style={{color: 'red'}}>*</span></label>
                        <select 
                            value={selectedLedgerId} 
                            onChange={handleLedgerChange} 
                            required 
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}
                        >
                            <option value="" disabled>Select Ledger / Customer</option>
                            {ledgers.map(l => (
                                <option key={l.id} value={l.id}>
                                    {l.customers?.name} - {formatVehicleNumber(l.vehicles?.vehicle_number)} (Due: ₹{parseFloat(l.due_amount).toLocaleString('en-IN')})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedLedger && (
                        <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#475569', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ledger Details</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', fontSize: '14px' }}>
                                <div><strong style={{ color: '#64748b' }}>Customer:</strong> {selectedLedger.customers?.name || 'Unknown'}</div>
                                <div><strong style={{ color: '#64748b' }}>Vehicle:</strong> {formatVehicleNumber(selectedLedger.vehicles?.vehicle_number)}</div>
                                <div><strong style={{ color: '#64748b' }}>Request No:</strong> {selectedLedger.service_requests?.request_no || '-'}</div>
                                <div><strong style={{ color: '#64748b' }}>Service:</strong> {selectedLedger.service_requests?.services?.service_name || '-'}</div>
                                <div><strong style={{ color: '#64748b' }}>Total Fee:</strong> ₹{parseFloat(selectedLedger.service_fee || 0).toLocaleString('en-IN')}</div>
                                <div><strong style={{ color: '#64748b' }}>Total Paid:</strong> ₹{parseFloat(selectedLedger.amount_paid || 0).toLocaleString('en-IN')}</div>
                            </div>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Amount Received (₹) <span style={{color: 'red'}}>*</span></label>
                            <input 
                                type="number" 
                                placeholder="Enter amount" 
                                required 
                                value={amountReceived} 
                                onChange={(e) => setAmountReceived(e.target.value)} 
                                min="0.01"
                                step="any"
                                disabled={!selectedLedger}
                            />
                        </div>
                        <div className="form-group">
                            <label>Payment Mode <span style={{color: 'red'}}>*</span></label>
                            <select 
                                value={paymentMode} 
                                onChange={(e) => setPaymentMode(e.target.value)} 
                                required 
                                style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}
                                disabled={!selectedLedger}
                            >
                                <option value="Cash">Cash</option>
                                <option value="Online">Online</option>
                                <option value="Razorpay">Razorpay</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Transaction Reference No.</label>
                            <input 
                                type="text" 
                                placeholder="Optional Reference" 
                                value={transactionReference} 
                                onChange={(e) => setTransactionReference(e.target.value)}
                                disabled={!selectedLedger}
                            />
                        </div>
                        <div className="form-group">
                            {/* Empty space for alignment */}
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Remarks</label>
                        <textarea 
                            rows="2" 
                            placeholder="Optional Remarks" 
                            value={remarks} 
                            onChange={(e) => setRemarks(e.target.value)}
                            disabled={!selectedLedger}
                        ></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="save-btn" disabled={!selectedLedger}>Generate Receipt</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReceiptModal;
