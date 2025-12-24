import React from 'react';
import { MathProblem } from '../types';
import { MathRenderer } from './MathRenderer';

interface TestResultDetailsProps {
    problems: MathProblem[];
    answers: (number | null)[];
}

export const TestResultDetails: React.FC<TestResultDetailsProps> = ({ problems, answers }) => {
    const optionLabels = ['①', '②', '③', '④', '⑤'];

    return (
        <div className="space-y-6">
            {problems.map((problem, index) => {
                const studentAnswerIndex = answers[index];
                const isCorrect = problem.correctAnswerIndex === studentAnswerIndex;

                return (
                    <div key={index} className="p-4 bg-background-light dark:bg-gray-800/50 rounded-lg border border-border-light dark:border-border-dark">
                        <div className="flex items-center justify-between mb-3">
                            <h5 className="text-lg font-bold text-text-light dark:text-text-dark">
                                {index + 1}번 문항
                            </h5>
                            <span className={`px-3 py-1 text-sm font-bold rounded-full ${isCorrect ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                {isCorrect ? '정답' : '오답'}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                           <div className="flex items-start">
                                <span className="font-semibold w-20">학생 답안:</span>
                                <span className="text-text-muted-light dark:text-text-muted-dark">
                                    {studentAnswerIndex !== null ? `${optionLabels[studentAnswerIndex]} ` : '선택 안함'}
                                    {studentAnswerIndex !== null && <MathRenderer text={problem.options[studentAnswerIndex]} />}
                                </span>
                            </div>
                             <div className="flex items-start">
                                <span className="font-semibold w-20">정답:</span>
                                <span className="text-text-muted-light dark:text-text-muted-dark font-bold">
                                    {`${optionLabels[problem.correctAnswerIndex]} `}
                                    <MathRenderer text={problem.options[problem.correctAnswerIndex]} />
                                </span>
                            </div>
                        </div>
                        
                        <div className="mt-2 p-3 bg-paper-light dark:bg-gray-700/50 rounded-md border border-border-light dark:border-border-dark">
                            <h6 className="font-semibold text-sm text-text-light dark:text-text-dark mb-1">AI 출제 의도 분석</h6>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark whitespace-pre-wrap leading-relaxed">
                                <MathRenderer text={problem.analysis} />
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};