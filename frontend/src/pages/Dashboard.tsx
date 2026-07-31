import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Users, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';

import Card from '../components/Card';
import AlertPanel from '../components/AlertPanel';
import './Dashboard.css';

// Mock Data
const riskDistribution = [
    { name: 'Low Risk', value: 65, color: '#10b981' },
    { name: 'Medium Risk', value: 25, color: '#f59e0b' },
    { name: 'High Risk', value: 10, color: '#ef4444' },
];

const loanTypeRisk = [
    { name: 'Personal', low: 4000, medium: 2400, high: 2400 },
    { name: 'Home', low: 3000, medium: 1398, high: 2210 },
    { name: 'Auto', low: 2000, medium: 9800, high: 2290 },
    { name: 'Credit Card', low: 2780, medium: 3908, high: 2000 },
];

const riskTrend = [
    { month: 'Jan', rate: 4.0 },
    { month: 'Feb', rate: 4.2 },
    { month: 'Mar', rate: 3.8 },
    { month: 'Apr', rate: 3.5 },
    { month: 'May', rate: 3.2 },
    { month: 'Jun', rate: 2.8 },
];

export default function Dashboard() {
    const [stats] = useState({
        totalBorrowers: '24,592',
        highRisk: '2,459',
        predictedExposure: '$14.2M',
        recoveryPotential: '68%',
    });

    return (
        <div className="dashboard-container fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Overview</h1>
                    <p className="page-subtitle">AI-Powered Loan Collection & Recovery</p>
                </div>
                <div className="date-filter">
                    <select defaultValue="30">
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                        <option value="90">Last Quarter</option>
                    </select>
                </div>
            </div>

            <div className="alerts-section">
                <AlertPanel
                    type="critical"
                    title="Critical Risk Escalation"
                    message="145 auto-loan borrowers have shifted to high-risk category in the last 48 hours."
                    action={{ label: 'View Borrowers', onClick: () => console.log('View') }}
                />
            </div>

            <div className="metrics-grid">
                <Card className="metric-card">
                    <div className="metric-icon-wrapper text-blue">
                        <Users size={24} />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Total Borrowers</p>
                        <h3 className="metric-value">{stats.totalBorrowers}</h3>
                        <p className="metric-trend positive">+2.4% this month</p>
                    </div>
                </Card>

                <Card className="metric-card">
                    <div className="metric-icon-wrapper text-red">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">High-Risk Borrowers</p>
                        <h3 className="metric-value">{stats.highRisk}</h3>
                        <p className="metric-trend negative">+12% this week</p>
                    </div>
                </Card>

                <Card className="metric-card">
                    <div className="metric-icon-wrapper text-orange">
                        <DollarSign size={24} />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Predicted NPA Exposure</p>
                        <h3 className="metric-value">{stats.predictedExposure}</h3>
                        <p className="metric-trend negative">+$1.2M at risk</p>
                    </div>
                </Card>

                <Card className="metric-card">
                    <div className="metric-icon-wrapper text-green">
                        <TrendingDown size={24} />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">AI Recovery Potential</p>
                        <h3 className="metric-value">{stats.recoveryPotential}</h3>
                        <p className="metric-trend positive">Optimized strategy ready</p>
                    </div>
                </Card>
            </div>

            <div className="charts-grid">
                <Card title="Risk Trend Over Time" className="col-span-2">
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={riskTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="var(--color-brand-500)"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Risk Distribution" className="col-span-1">
                    <div className="chart-container flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number | string | Array<any> | undefined) => `${value || 0}%`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Loan Type vs Risk" className="col-span-3">
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={loanTypeRisk}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-surface-hover)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                                />
                                <Legend />
                                <Bar dataKey="low" name="Low Risk" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="medium" name="Medium Risk" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="high" name="High Risk" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
