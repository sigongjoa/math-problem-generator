import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';
import { EditIcon } from './icons';
import { MathRenderer } from './MathRenderer';

interface ProblemAnalysisProps {
    problems: MathProblem[];
    editingIndex: number | null;
    onEdit: (index: number) => void;
    onSave: (index: number, updatedProblem: MathProblem) => void;
    onCancel: () => void;
}

const tagColors: { [key: string]: string } = {
    '개념 이해': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    '계산 능력': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    '응용 문제': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    '추론 능력': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    '복합 문제': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const getTagColor = (type: string) => {
    const key = Object.keys(tagColors).find(t => type.includes(t)) || '개념 이해';
    return tagColors[key];
}

const AnalysisItem: React.FC<{
    problem: MathProblem;
    index: number;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (updatedProblem: MathProblem) => void;
    onCancel: () => void;
    isAnyEditing: boolean;
}> = ({ problem, index, isEditing, onEdit, onSave, onCancel, isAnyEditing }) => {
    const [editableProblem, setEditableProblem] = useState(problem);

    useEffect(() => {
        setEditableProblem(problem);
    }, [problem]);

    const handleSave = () => {
        onSave(editableProblem);
    };

    const handleChange = (field: keyof MathProblem, value: string) => {
        setEditableProblem(prev => ({ ...prev, [field]: value }));
    };

    if (isEditing) {
        return (
             <div className="p-6 bg-background-light dark:bg-gray-800 rounded-lg border border-primary shadow-sm">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="text-xl font-bold text-primary">
                        {index + 1}번 문제 (수정 중)
                    </span>
                     <input
                        type="text"
                        value={editableProblem.problemType}
                        onChange={(e) => handleChange('problemType', e.target.value)}
                        className="px-3 py-1 text-sm font-medium rounded-full bg-paper-light dark:bg-gray-700 border border-border-light dark:border-border-dark"
                    />
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-2 text-text-light dark:text-text-dark">출제 의도 및 분석</h4>
                    <textarea
                        value={editableProblem.analysis}
                        onChange={(e) => handleChange('analysis', e.target.value)}
                        rows={4}
                        className="w-full p-2 text-text-muted-light dark:text-text-muted-dark leading-relaxed bg-paper-light dark:bg-gray-700 border border-border-light dark:border-border-dark rounded-md"
                    />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-md text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-gray-600">취소</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold rounded-md bg-primary text-white hover:bg-blue-600">저장</button>
                </div>
            </div>
        )
    }

    return (
        <div className="relative group p-6 bg-background-light dark:bg-gray-800 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
            <button
                onClick={onEdit}
                disabled={isAnyEditing}
                className="absolute top-2 right-2 p-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-border-light dark:hover:bg-border-dark opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="분석 수정"
            >
                <EditIcon className="w-5 h-5" />
            </button>
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-xl font-bold text-primary">
                    {index + 1}번 문제
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTagColor(problem.problemType)}`}>
                    {problem.problemType}
                </span>
            </div>
            <div>
                <h4 className="font-semibold text-lg mb-2 text-text-light dark:text-text-dark">출제 의도 및 분석</h4>
                <div className="text-text-muted-light dark:text-text-muted-dark leading-relaxed whitespace-pre-wrap">
                   <MathRenderer text={problem.analysis} />
                </div>
            </div>
        </div>
    );
};


export const ProblemAnalysis: React.FC<ProblemAnalysisProps> = ({ problems, editingIndex, onEdit, onSave, onCancel }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-text-light dark:text-text-dark border-b-2 border-text-light dark:border-text-dark pb-4 mb-8">
                문제 분석 보고서
            </h3>
            <div className="space-y-8">
                {problems.map((problem, index) => (
                    <AnalysisItem
                        key={index}
                        problem={problem}
                        index={index}
                        isEditing={editingIndex === index}
                        onEdit={() => onEdit(index)}
                        onSave={(updatedProblem) => onSave(index, updatedProblem)}
                        onCancel={onCancel}
                        isAnyEditing={editingIndex !== null}
                    />
                ))}
            </div>
        </div>
    );
};