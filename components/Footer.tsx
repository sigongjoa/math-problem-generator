
import React from 'react';

interface FooterProps {
    problemCount: number;
}

export const Footer: React.FC<FooterProps> = ({ problemCount }) => (
    <footer className="mt-8">
        <div className="flex justify-center items-center">
            <div className="bg-text-light dark:bg-text-dark text-paper-light dark:text-paper-dark font-bold text-sm px-4 py-1 rounded">
                <span>1</span> / {Math.ceil(problemCount / 4) || 1}
            </div>
        </div>
    </footer>
);
