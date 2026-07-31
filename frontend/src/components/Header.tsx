import './Header.css';
import { Bell, Search, Globe } from 'lucide-react';

export default function Header() {
    return (
        <header className="header">
            <div className="header-search">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Search borrowers, IDs, or loans..." />
            </div>

            <div className="header-actions">
                <div className="language-selector">
                    <Globe size={18} />
                    <select>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                    </select>
                </div>

                <button className="icon-btn notification-btn">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                </button>

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
