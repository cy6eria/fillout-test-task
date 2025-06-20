import React from 'react';
import cx from 'classnames';
import * as Icons from 'lucide-react';

interface AddButtonProps {
    icon: keyof typeof Icons;
    onClick: () => void;
    children: React.ReactNode;
}

export function AddButton ({ icon, onClick, children }: AddButtonProps) {
    const Icon = Icons[icon] as React.ComponentType<{ size: number; className?: string }>;
    return (
        <button
            onClick={onClick}
            className={cx(
                'group flex items-center gap-1.5 px-2.25 py-1.25 shadow-none',
                'touch-manipulation cursor-pointer rounded-lg',
                'bg-button-bg hover:bg-button-bg-hovered',
                'font-medium text-sm whitespace-nowrap',
                'transition-[background-color] duration-300',
                'bg-white text-button-text-active border-1 border-gray shadow-xs',
                'focus:border-blue focus:ring-2 focus:ring-blue/25 outline-0',
            )}
        >
            <Icon size={16} />
            <span>{children}</span>
        </button>
    );
}
