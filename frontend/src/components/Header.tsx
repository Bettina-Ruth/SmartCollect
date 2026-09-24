import { useState } from 'react';
import './Header.css';
import { Bell } from 'lucide-react';

export default function Header() {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="header">
            <div></div>

            <div className="header-actions">
                <div className="notification-wrapper">
                    <button
                        className="icon-btn notification-btn"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} />
                        <span className="notification-badge">3</span>
                    </button>

                    {showNotifications && (
                        <div className="notification-panel">
                            <div className="notification-header">
                                <strong>Notifications</strong>
                            </div>
                            <div className="notification-item">
                                <strong>Critical Risk Alert</strong>
                                <span>145 auto-loan borrowers shifted to high risk.</span>
                            </div>
                            <div className="notification-item">
                                <strong>Recovery Update</strong>
                                <span>12 high-risk cases require follow-up.</span>
                            </div>
                            <div className="notification-item">
                                <strong>System Update</strong>
                                <span>Risk analysis data has been refreshed.</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="user-profile">
                    <div className="avatar">A</div>
                    <div className="user-info">
                        <span className="user-name">Alex Officer</span>
                        <span className="user-role">Recovery Agent</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
