import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';
import Card from '../components/Card';
import './Analytics.css';

const npaComparisonData = [
    { month: 'Jan', beforeAI: 4.2, afterAI: 4.2 },
    { month: 'Feb', beforeAI: 4.5, afterAI: 3.8 },
    { month: 'Mar', beforeAI: 4.8, afterAI: 3.1 },
    { month: 'Apr', beforeAI: 5.2, afterAI: 2.7 },
    { month: 'May', beforeAI: 5.5, afterAI: 2.4 },
    { month: 'Jun', beforeAI: 5.8, afterAI: 2.1 },
];

const recoveryMetrics = [
    { category: 'Auto Loan', automated: 68, manual: 32 },
    { category: 'Personal', automated: 45, manual: 55 },
    { category: 'Home Loan', automated: 82, manual: 18 },
    { category: 'Credit Card', automated: 91, manual: 9 },
];

export default function Analytics() {
    return (
        <div className="page-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Business Impact Analysis</h1>
                    <p className="page-subtitle">Measuring the ROI of AI-driven recovery</p>
                </div>
                <div className="date-filter">
                    <select defaultValue="ytd">
                        <option value="ytd">Year to Date (YTD)</option>
                        <option value="1y">Last 1 Year</option>
                    </select>
                </div>
            </div>

            <div className="impact-grid">
                <Card className="impact-card primary-impact">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="impact-label">Total NPA Prevention</p>
                            <h2 className="impact-value">₹24.5 Cr</h2>
                        </div>
                        <div className="impact-icon-bg">
                            <ShieldCheck size={32} />
                        </div>
                    </div>
                    <div className="impact-footer">
                        <span className="trend positive flex items-center gap-1">
                            <TrendingUp size={16} /> +18.4% improvement
                        </span>
                        <span className="text-muted text-sm ml-2">vs. previous model</span>
                    </div>
                </Card>

                <div className="impact-stats-grid">
                    <Card className="p-4">
                        <p className="text-sm text-secondary mb-1">Cost of Collection</p>
                        <h3 className="text-xl font-bold mb-2">₹142 / account</h3>
                        <span className="trend positive text-sm flex items-center gap-1">
                            <ArrowDownRight size={14} /> -32% reduction
                        </span>
                    </Card>

                    <Card className="p-4">
                        <p className="text-sm text-secondary mb-1">Agent Productivity</p>
                        <h3 className="text-xl font-bold mb-2">48 cases / day</h3>
                        <span className="trend positive text-sm flex items-center gap-1">
                            <ArrowUpRight size={14} /> +2.4x higher
                        </span>
                    </Card>

                    <Card className="p-4">
                        <p className="text-sm text-secondary mb-1">Time to Recover</p>
                        <h3 className="text-xl font-bold mb-2">14 Days</h3>
                        <span className="trend positive text-sm flex items-center gap-1">
                            <ArrowDownRight size={14} /> -45% faster
                        </span>
                    </Card>

                    <Card className="p-4">
                        <p className="text-sm text-secondary mb-1">Digital Engagement</p>
                        <h3 className="text-xl font-bold mb-2">68%</h3>
                        <span className="trend positive text-sm flex items-center gap-1">
                            <ArrowUpRight size={14} /> +41% reach
                        </span>
                    </Card>
                </div>
            </div>

            <div className="charts-grid mt-6">
                <Card title="Predicted NPA Trajectory: With vs Without AI" className="col-span-2">
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={npaComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAfterAI" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-brand-500)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-brand-500)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorBeforeAI" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                                <Legend verticalAlign="top" height={36} />
                                <Area type="monotone" dataKey="beforeAI" name="Without AI (Baseline)" stroke="#ef4444" fillOpacity={1} fill="url(#colorBeforeAI)" strokeDasharray="5 5" />
                                <Area type="monotone" dataKey="afterAI" name="With SmartCollect AI" stroke="var(--color-brand-500)" strokeWidth={3} fillOpacity={1} fill="url(#colorAfterAI)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Recovery Channel Efficiency">
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={recoveryMetrics} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                                <Legend verticalAlign="top" height={36} />
                                <Bar dataKey="automated" name="Automated Digital AI" stackId="a" fill="var(--color-brand-500)" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="manual" name="Manual Agent Follow-up" stackId="a" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
