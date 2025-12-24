import React from 'react';

interface HeaderProps {
    pageType: 'generator' | 'levelTest';
    problemCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ pageType, problemCount }) => {
    const problemCountForTitle = problemCount ?? 10;
    const levelTestTitle = `AI 수학 사고력 진단 테스트 (약 ${problemCountForTitle * 3}분 소요)`;
    
    return (
        <header className="mb-6">
            <h1 className="text-center font-bold text-lg text-text-light dark:text-text-dark tracking-wider">
                {pageType === 'generator' ? 'AI 생성 맞춤 수학 문제지' : levelTestTitle}
            </h1>
            <div className="flex justify-between items-center mt-4 border-b-2 border-text-light dark:border-text-dark pb-1">
                <div className="flex items-center space-x-2">
                    <span className="border-2 border-text-light dark:border-text-dark rounded-full px-4 py-1 text-sm font-semibold">
                        제 2 교시
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-widest">수학 영역</h2>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="bg-text-light dark:bg-text-dark text-paper-light dark:text-paper-dark px-4 py-1 font-bold text-sm rounded">
                        진단형
                    </span>
                    <span className="text-2xl sm:text-4xl font-bold">1</span>
                </div>
            </div>
        </header>
    );
};