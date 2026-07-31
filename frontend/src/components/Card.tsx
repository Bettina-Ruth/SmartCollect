import type { ReactNode } from 'react';
import './Card.css';

interface CardProps {
    children: ReactNode;
    title?: string;
    className?: string;
    action?: ReactNode;
}

export default function Card({ children, title, className = '', action }: CardProps) {
    return (
        <div className={`card ${className}`}>
            {(title || action) && (
                <div className="card-header">
                    {title && <h3 className="card-title">{title}</h3>}
                    {action && <div className="card-action">{action}</div>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}
