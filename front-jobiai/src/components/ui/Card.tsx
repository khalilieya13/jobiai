import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    selected?: boolean;
}

const Card: React.FC<CardProps> = ({
                                       children,
                                       className = '',
                                       onClick,
                                       selected = false
                                   }) => {
    const baseStyles = 'bg-white rounded-lg shadow-sm p-6 transition-all';
    const interactiveStyles = onClick ? 'cursor-pointer hover:shadow-md' : '';
    const selectedStyles = selected
        ? 'border-2 border-indigo-500 ring-2 ring-indigo-200'
        : 'border border-gray-200';

    return (
        <div
            className={`${baseStyles} ${interactiveStyles} ${selectedStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;