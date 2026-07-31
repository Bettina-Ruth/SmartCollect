import { AlertTriangle, Info, XCircle } from 'lucide-react';
import './AlertPanel.css';

type AlertType = 'critical' | 'warning' | 'info';

interface AlertPanelProps {
    type: AlertType;
    title: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const icons = {
    critical: XCircle,
    warning: AlertTriangle,
    info: Info,
};

export default function AlertPanel({ type, title, message, action }: AlertPanelProps) {
    const Icon = icons[type];

    return (
        <div className={`alert-panel alert-${type}`}>
            <div className="alert-icon">
                <Icon size={24} />
            </div>
            <div className="alert-content">
                <h4 className="alert-title">{title}</h4>
                <p className="alert-message">{message}</p>
            </div>
            {action && (
                <button className="alert-action" onClick={action.onClick}>
                    {action.label}
                </button>
            )}
        </div>
    );
}
