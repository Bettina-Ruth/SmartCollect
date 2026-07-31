import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone, Calendar, IndianRupee, Activity, Clock, FileText } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { mockApiService } from '../services/api';
import type { Borrower } from '../services/api';
import './BorrowerDetail.css';

export default function BorrowerDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [borrower, setBorrower] = useState<Borrower | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchBorrower = async () => {
            try {
                const data = await mockApiService.getBorrowerById(id);
                setBorrower(data || null);
            } catch (error) {
                console.error("Failed to fetch borrower:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBorrower();
    }, [id]);

    if (loading) {
        return <div className="page-container p-8 text-center">Loading borrower details...</div>;
    }

    if (!borrower) {
        return (
            <div className="page-container p-8 text-center">
                <h2>Borrower Not Found</h2>
                <button className="btn btn-outline mt-4" onClick={() => navigate('/borrowers')}>
                    Back to Directory
                </button>
            </div>
        );
    }

    const getRiskVariant = (category: string) => {
        if (category === 'High') return 'danger';
        if (category === 'Medium') return 'warning';
        return 'success';
    };

    const riskVariant = getRiskVariant(borrower.riskCategory);

    return (
        <div className="page-container fade-in detail-layout">
            <div className="detail-header">
                <button className="back-btn" onClick={() => navigate('/borrowers')}>
                    <ArrowLeft size={20} />
                    Back to Directory
                </button>
                <div className="detail-actions">
                    <button className="btn btn-outline">
                        <Phone size={18} />
                        Call Agent
                    </button>
                    <button className="btn btn-primary">
                        <MessageSquare size={18} />
                        Send Notice
                    </button>
                </div>
            </div>

            <div className="detail-grid">
                <div className="detail-sidebar">
                    <Card className="profile-card text-center relative overflow-hidden">
                        <div className={`profile-accent bg-${riskVariant}`}></div>
                        <div className="avatar-large mx-auto mt-6 mb-4">{borrower.name.charAt(0)}</div>
                        <h2 className="profile-name text-xl font-bold">{borrower.name}</h2>
                        <p className="profile-id text-muted mb-4">{borrower.id}</p>
                        <Badge variant={riskVariant} className="mb-6">{borrower.riskCategory} Risk</Badge>

                        <div className="contact-info border-t pt-4 text-left">
                            <div className="info-row">
                                <Phone size={16} className="text-muted" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="info-row">
                                <MessageSquare size={16} className="text-muted" />
                                <span>{borrower.name.split(' ')[0].toLowerCase()}@email.com</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Loan Summary" className="mt-6">
                        <div className="summary-grid">
                            <div className="summary-item">
                                <span className="summary-label">Loan Type</span>
                                <div className="summary-value flex items-center gap-2">
                                    <FileText size={16} className="text-blue" />
                                    {borrower.loanType}
                                </div>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">EMI Amount</span>
                                <div className="summary-value flex items-center gap-2">
                                    <IndianRupee size={16} className="text-orange" />
                                    ₹{borrower.emiAmount.toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Next Due Date</span>
                                <div className="summary-value flex items-center gap-2">
                                    <Calendar size={16} className="text-green" />
                                    15th Oct 2024
                                </div>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Days Past Due</span>
                                <div className={`summary-value flex items-center gap-2 ${borrower.daysPastDue > 0 ? 'text-danger font-medium' : ''}`}>
                                    <Clock size={16} />
                                    {borrower.daysPastDue > 0 ? `${borrower.daysPastDue} Days` : 'On Time'}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="detail-main">
                    <Card title="AI Risk Analysis" className="mb-6">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="risk-score-display">
                                <div className={`score-ring text-${riskVariant}`}>
                                    <Activity size={32} />
                                    <span className="score-value">{borrower.riskScore}</span>
                                </div>
                                <span className="score-desc">AI Risk Score (out of 100)</span>
                            </div>

                            <div className="flex-1 max-w-md">
                                <h4 className="mb-3 font-medium text-sm text-secondary uppercase tracking-wider">Top Risk Drivers</h4>
                                <ul className="risk-drivers-list">
                                    <li>
                                        <span className="driver-bullet bg-danger"></span>
                                        <span>Missed 2 consecutive payments in last 3 months</span>
                                    </li>
                                    <li>
                                        <span className="driver-bullet bg-warning"></span>
                                        <span>Recent decline in monthly average balance</span>
                                    </li>
                                    <li>
                                        <span className="driver-bullet bg-warning"></span>
                                        <span>High credit utilization across other facilities</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="recommendation-box">
                            <h4>AI Recommended Strategy</h4>
                            <p className="font-medium text-blue mb-2">{borrower.recommendedAction}</p>
                            <p className="text-sm text-muted mb-4">
                                Based on the borrower's digital footprint and historical recovery patterns,
                                this strategy offers a 78% probability of successful resolution within 14 days.
                            </p>
                        </div>
                    </Card>

                    <Card title="Generated Communication Preview">
                        <div className="message-preview-container">
                            <div className="message-tabs">
                                <button className="tab active">WhatsApp</button>
                                <button className="tab">Email</button>
                                <button className="tab">SMS</button>
                            </div>
                            <div className="message-content">
                                <div className="whatsapp-bubble">
                                    <p>Dear {borrower.name.split(' ')[0]},</p>
                                    <p>This is a gentle reminder regarding your {borrower.loanType} EMI of ₹{borrower.emiAmount.toLocaleString('en-IN')}, which was due recently.</p>
                                    <p>We notice you've been a valued customer. If you're facing temporary difficulties, we can help you with a customized restructuring plan.</p>
                                    <p>Please click below to pay now or request assistance.</p>
                                    <div className="whatsapp-actions">
                                        <button className="wa-btn">Pay ₹{borrower.emiAmount.toLocaleString('en-IN')}</button>
                                        <button className="wa-btn">Request Help</button>
                                    </div>
                                </div>
                            </div>
                            <div className="message-footer mt-4 flex justify-end gap-3">
                                <button className="btn btn-outline text-sm py-1">Regenerate Message</button>
                                <button className="btn btn-primary text-sm py-1">Approve & Send</button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
