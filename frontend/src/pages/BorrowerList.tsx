import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, Download } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { mockApiService } from '../services/api';
import type { Borrower } from '../services/api';
import './BorrowerList.css';

export default function BorrowerList() {
    const [borrowers, setBorrowers] = useState<Borrower[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [riskFilter, setRiskFilter] = useState('All');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBorrowers = async () => {
            try {
                const data = await mockApiService.getBorrowers();
                setBorrowers(data);
            } catch (error) {
                console.error("Failed to fetch borrowers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBorrowers();
    }, []);

    const filteredBorrowers = borrowers.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = riskFilter === 'All' || b.riskCategory === riskFilter;
        return matchesSearch && matchesRisk;
    });

    const getRiskVariant = (category: string) => {
        if (category === 'High') return 'danger';
        if (category === 'Medium') return 'warning';
        return 'success';
    };

    return (
        <div className="page-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Borrower Directory</h1>
                    <p className="page-subtitle">Manage and track loan portfolios</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline">
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
            </div>

            <Card className="table-card">
                <div className="table-controls">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-box">
                        <Filter size={18} className="filter-icon" />
                        <select
                            value={riskFilter}
                            onChange={(e) => setRiskFilter(e.target.value)}
                        >
                            <option value="All">All Risk Levels</option>
                            <option value="High">High Risk</option>
                            <option value="Medium">Medium Risk</option>
                            <option value="Low">Low Risk</option>
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Customer Details</th>
                                <th>Loan Type</th>
                                <th className="text-right">EMI Amount</th>
                                <th>Risk Score</th>
                                <th>Category</th>
                                <th className="text-right">Days Past Due</th>
                                <th>Recommended Action</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-8">Loading borrowers...</td>
                                </tr>
                            ) : filteredBorrowers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-8">No borrowers found matching criteria.</td>
                                </tr>
                            ) : (
                                filteredBorrowers.map((borrower) => (
                                    <tr key={borrower.id} className={borrower.riskCategory === 'High' ? 'row-highlight' : ''}>
                                        <td>
                                            <div className="customer-info">
                                                <span className="customer-name">{borrower.name}</span>
                                                <span className="customer-id">{borrower.id}</span>
                                            </div>
                                        </td>
                                        <td>{borrower.loanType}</td>
                                        <td className="text-right font-medium">
                                            ₹{borrower.emiAmount.toLocaleString('en-IN')}
                                        </td>
                                        <td>
                                            <div className="progress-bar-container">
                                                <div
                                                    className={`progress-bar bg-${getRiskVariant(borrower.riskCategory)}`}
                                                    style={{ width: `${borrower.riskScore}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-muted mt-1">{borrower.riskScore}/100</span>
                                        </td>
                                        <td>
                                            <Badge variant={getRiskVariant(borrower.riskCategory)}>
                                                {borrower.riskCategory}
                                            </Badge>
                                        </td>
                                        <td className="text-right text-danger font-medium">
                                            {borrower.daysPastDue > 0 ? `${borrower.daysPastDue} Days` : '-'}
                                        </td>
                                        <td>
                                            <span className="action-tag">{borrower.recommendedAction}</span>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                className="btn-icon"
                                                onClick={() => navigate(`/borrowers/${borrower.id}`)}
                                                title="View Details"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
