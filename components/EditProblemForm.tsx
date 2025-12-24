import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';

interface EditProblemFormProps {
    problem: MathProblem;
    onSave: (updatedProblem: MathProblem) => void;
    onCancel: () => void;
}

const FormInputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">{label}</label>
        {children}
    </div>
);

export const EditProblemForm: React.FC<EditProblemFormProps> = ({ problem, onSave, onCancel }) => {
    const [editableProblem, setEditableProblem] = useState<MathProblem>(problem);

    useEffect(() => {
        setEditableProblem(problem);
    }, [problem]);

    const handleSave = () => {
        onSave(editableProblem);
    };

    const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditableProblem(prev => ({ ...prev, question: e.target.value }));
    };
    
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...editableProblem.options];
        newOptions[index] = value;
        setEditableProblem(prev => ({ ...prev, options: newOptions }));
    };

    const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableProblem(prev => ({ ...prev, points: parseInt(e.target.value, 10) || 2 }));
    };

    const inputStyles = "w-full p-2 bg-paper-light dark:bg-gray-700 border border-border-light dark:border-border-dark rounded-md focus:ring-primary focus:border-primary transition";
    const optionLabels = ['①', '②', '③', '④', '⑤'];

    return (
        <div className="p-4 border-2 border-primary rounded-lg bg-blue-50 dark:bg-gray-800">
            <h3 className="text-lg font-bold mb-4 text-primary">문제 수정 중...</h3>
            
            <FormInputGroup label="문제 내용">
                <textarea 
                    value={editableProblem.question} 
                    onChange={handleQuestionChange} 
                    rows={5} 
                    className={inputStyles}
                />
            </FormInputGroup>

            <FormInputGroup label="선택지">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {editableProblem.options.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2">
                             <span className="font-semibold">{optionLabels[i]}</span>
                             <input 
                                type="text" 
                                value={option} 
                                onChange={(e) => handleOptionChange(i, e.target.value)} 
                                className={inputStyles}
                            />
                        </div>
                    ))}
                </div>
            </FormInputGroup>
            
            <FormInputGroup label="배점">
                 <input 
                    type="number"
                    min="2"
                    max="4" 
                    value={editableProblem.points} 
                    onChange={handlePointsChange} 
                    className={`${inputStyles} w-24`}
                />
            </FormInputGroup>
            
            <div className="flex justify-end space-x-2 mt-6">
                <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-md text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-gray-600">취소</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold rounded-md bg-primary text-white hover:bg-blue-600">저장</button>
            </div>
        </div>
    );
};