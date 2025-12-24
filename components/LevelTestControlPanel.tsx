import React, { useState, useMemo, useEffect, useRef } from 'react';
import { curriculum } from '../curriculumData';
import { LevelTestParams } from '../services/geminiService';
import { LoadingIcon, SparklesIcon, UploadIcon } from './icons';

interface LevelTestControlPanelProps {
    onGenerate: (params: LevelTestParams) => void;
    isGenerating: boolean;
    onUpload: (file: File) => void;
}

const FormInputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">{label}</label>
        {children}
    </div>
);

export const LevelTestControlPanel: React.FC<LevelTestControlPanelProps> = ({ onGenerate, isGenerating, onUpload }) => {
    const [educationLevel, setEducationLevel] = useState<'elementary' | 'middle' | 'high'>('high');
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [problemCount, setProblemCount] = useState<number>(10);
    const [studentDescription, setStudentDescription] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const gradeOptions = useMemo(() => Object.keys(curriculum[educationLevel]), [educationLevel]);
    
    // Reset selections when education level changes
    useEffect(() => {
        if (gradeOptions.length > 0) {
            // Default to the first option
            setSelectedSubjects([gradeOptions[0]]);
        } else {
            setSelectedSubjects([]);
        }
    }, [educationLevel, gradeOptions]);

    const toggleSubject = (subject: string) => {
        setSelectedSubjects(prev => {
            if (prev.includes(subject)) {
                // Prevent deselecting the last item
                if (prev.length === 1) return prev;
                return prev.filter(s => s !== subject);
            } else {
                return [...prev, subject];
            }
        });
    };

    const handleSelectAll = () => {
        setSelectedSubjects(gradeOptions);
    };

    const handleDeselectAll = () => {
        // Keep at least one selected if possible, otherwise clear (but logic prevents submit empty)
        if (gradeOptions.length > 0) {
            setSelectedSubjects([gradeOptions[0]]);
        } else {
            setSelectedSubjects([]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate({
            educationLevel: educationLevel === 'elementary' ? '초등학교' : (educationLevel === 'middle' ? '중학교' : '고등학교'),
            subjects: selectedSubjects,
            problemCount,
            studentDescription,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
            if(e.target) e.target.value = '';
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
    const selectStyles = "w-full p-3 bg-paper-light dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-md focus:ring-primary focus:border-primary transition disabled:opacity-50";

    return (
        <div className="bg-paper-light dark:bg-paper-dark p-6 rounded-lg shadow-md border border-border-light dark:border-border-dark sticky top-8">
            <h2 className="text-2xl font-bold mb-2 text-text-light dark:text-text-dark border-b border-border-light dark:border-border-dark pb-4">AI 진단 테스트</h2>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2 mb-6">
                선택한 과목/학년들의 주요 단원에서 문제를 골고루 출제하여 실력을 종합적으로 진단합니다.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInputGroup label="과정">
                    <select value={educationLevel} onChange={e => setEducationLevel(e.target.value as 'elementary' | 'middle' | 'high')} disabled={isGenerating} className={selectStyles}>
                        <option value="elementary">초등학교</option>
                        <option value="middle">중학교</option>
                        <option value="high">고등학교</option>
                    </select>
                </FormInputGroup>

                <FormInputGroup label="과목/학년 (복수 선택 가능)">
                    <div className="flex justify-end space-x-2 mb-2">
                        <button type="button" onClick={handleSelectAll} className="text-xs text-primary hover:underline">전체 선택</button>
                        <button type="button" onClick={handleDeselectAll} className="text-xs text-text-muted-light dark:text-text-muted-dark hover:underline">선택 해제</button>
                    </div>
                     <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-gray-800/50">
                        {gradeOptions.map(g => (
                            <label key={g} className="flex items-center space-x-3 p-2 rounded hover:bg-paper-light dark:hover:bg-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedSubjects.includes(g)}
                                    onChange={() => toggleSubject(g)}
                                    disabled={isGenerating}
                                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <span className="text-sm font-medium text-text-light dark:text-text-dark">{g}</span>
                            </label>
                        ))}
                    </div>
                </FormInputGroup>

                <FormInputGroup label="문제 수">
                    <input
                        type="number"
                        value={problemCount}
                        onChange={e => setProblemCount(Math.max(5, Math.min(20, parseInt(e.target.value, 10) || 5)))}
                        min="5"
                        max="20"
                        disabled={isGenerating}
                        className={selectStyles}
                    />
                </FormInputGroup>
                
                <FormInputGroup label="학생 맞춤 설명 (선택 사항)">
                    <textarea
                        value={studentDescription}
                        onChange={e => setStudentDescription(e.target.value)}
                        disabled={isGenerating}
                        rows={4}
                        placeholder="예: 여러 과목에 대한 종합적인 실력 점검을 원함."
                        className={`${selectStyles} resize-y`}
                    />
                </FormInputGroup>

                <button
                    type="submit"
                    disabled={isGenerating || selectedSubjects.length === 0}
                    className="w-full flex items-center justify-center px-6 py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isGenerating ? (
                        <>
                            <LoadingIcon className="w-6 h-6 mr-3 animate-spin" />
                            진단 테스트 생성 중...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-6 h-6 mr-3" />
                            진단 테스트 생성하기
                        </>
                    )}
                </button>
            </form>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-border-light dark:border-border-dark" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-paper-light dark:bg-paper-dark px-2 text-sm text-text-muted-light dark:text-text-muted-dark">또는</span>
                </div>
            </div>
            
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
                disabled={isGenerating}
            />
            <button
                type="button"
                onClick={handleUploadClick}
                disabled={isGenerating}
                className="w-full flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            >
                <UploadIcon className="w-5 h-5 mr-3" />
                JSON 파일로 테스트 시작
            </button>
        </div>
    );
};