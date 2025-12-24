import React from 'react';
import { SparklesIcon, DocumentTextIcon } from './icons';

interface NavigationProps {
    currentPage: 'generator' | 'levelTest';
    onNavigate: (page: 'generator' | 'levelTest') => void;
    isDisabled: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, isDisabled }) => {
    
    const getButtonClass = (page: 'generator' | 'levelTest') => {
        const baseClass = "flex-1 flex items-center justify-center px-4 py-3 text-sm sm:text-base font-bold rounded-lg transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed";
        if (currentPage === page) {
            return `${baseClass} bg-primary text-white shadow-lg scale-105`;
        }
        return `${baseClass} bg-paper-light dark:bg-gray-800 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-gray-700`;
    };

    return (
        <div className="mb-8 p-1 bg-background-light dark:bg-gray-900/50 rounded-xl shadow-md border border-border-light dark:border-border-dark flex space-x-1">
            <button
                onClick={() => onNavigate('generator')}
                disabled={isDisabled}
                className={getButtonClass('generator')}
            >
                <SparklesIcon className="w-5 h-5 mr-2" />
                <span>맞춤 문제 생성</span>
            </button>
            <button
                onClick={() => onNavigate('levelTest')}
                disabled={isDisabled}
                className={getButtonClass('levelTest')}
            >
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                <span>AI 진단 테스트</span>
            </button>
        </div>
    );
};