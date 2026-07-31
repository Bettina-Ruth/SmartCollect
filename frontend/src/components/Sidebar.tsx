import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BarChart2, MessageSquare, Settings } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/borrowers', label: 'Borrowers', icon: Users },
        { path: '/analytics', label: 'Analytics', icon: BarChart2 },
        { path: '/chatbot', label: 'Chatbot Demo', icon: MessageSquare },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon"></div>
                <span>SmartCollect</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <item.icon className="nav-icon" size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item">
                    <Settings className="nav-icon" size={20} />
                    <span>Settings</span>
                </button>
            </div>
        </div>
    );
}
