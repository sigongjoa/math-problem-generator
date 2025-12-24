
import React from 'react';
import { MathProblem } from '../types';
import { EditProblemForm } from './EditProblemForm';
import { EditIcon } from './icons';
import { MathRenderer } from './MathRenderer';

interface ProblemCardProps {
    problem: MathProblem;
    index: number;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (updatedProblem: MathProblem) => void;
    onCancel: () => void;
    isAnyEditing: boolean;
    selectedAnswer: number | null | undefined;
    onAnswerSelect: (optionIndex: number) => void;
    isSubmitted: boolean;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ 
    problem, index, isEditing, onEdit, onSave, onCancel, isAnyEditing,
    selectedAnswer, onAnswerSelect, isSubmitted 
}) => {
    
    if (isEditing) {
        return (
            <div className="problem-card space-y-4 pt-12 first:pt-0 border-t first:border-t-0 border-dashed border-border-light dark:border-border-dark">
               <EditProblemForm problem={problem} onSave={onSave} onCancel={onCancel} />
            </div>
        )
    }

    const optionLabels = ['①', '②', '③', '④', '⑤'];

    const getOptionClass = (optionIndex: number) => {
        const baseClass = "w-full text-left p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3";

        if (isSubmitted) {
            const isCorrect = optionIndex === problem.correctAnswerIndex;
            const isSelected = optionIndex === selectedAnswer;

            if (isCorrect) {
                return `${baseClass} bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-600 dark:text-green-200 font-bold`;
            }
            if (isSelected && !isCorrect) {
                 return `${baseClass} bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-600 dark:text-red-200`;
            }
            return `${baseClass} border-transparent text-text-muted-light dark:text-text-muted-dark`;
        }

        if (selectedAnswer === optionIndex) {
            return `${baseClass} bg-blue-100 border-primary dark:bg-blue-900/50 dark:border-primary shadow-md`;
        }
        
        return `${baseClass} border-transparent hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600`;
    };
    
    return (
        <div className="problem-card space-y-4 pt-12 first:pt-0 border-t first:border-t-0 border-dashed border-border-light dark:border-border-dark relative group">
            {!isSubmitted && (
                 <button
                    onClick={onEdit}
                    disabled={isAnyEditing}
                    className="absolute top-2 right-2 p-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-border-light dark:hover:bg-border-dark opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
                    aria-label="문제 수정"
                >
                    <EditIcon className="w-5 h-5" />
                </button>
            )}
            <div>
                <div className="mb-4 text-xl leading-relaxed">
                    <span className="font-bold mr-2">{index + 1}.</span> 
                    <MathRenderer text={problem.question} />
                    <span className="text-text-muted-light dark:text-text-muted-dark ml-2">[{problem.points}점]</span>
                </div>

                {/* SVG 이미지 렌더링 영역 */}
                {problem.svgImage && (
                    <div className="my-6 flex justify-center p-4 bg-white rounded-lg border border-border-light shadow-sm max-w-full overflow-hidden">
                        <div 
                            className="w-full max-w-md"
                            dangerouslySetInnerHTML={{ __html: problem.svgImage }} 
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-x-4 gap-y-2 text-md px-2">
                    {problem.options.map((option, i) => (
                        <button key={i} onClick={() => onAnswerSelect(i)} disabled={isSubmitted} className={getOptionClass(i)}>
                            <span className="font-semibold">{optionLabels[i]}</span>
                            <MathRenderer text={option} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
