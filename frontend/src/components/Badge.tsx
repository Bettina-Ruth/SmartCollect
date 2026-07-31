import type { ReactNode } from 'react';
import './Badge.css';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

export default function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
    return (
        <span className={`badge badge-${variant} ${className}`}>
            {children}
        </span>
    );
}
