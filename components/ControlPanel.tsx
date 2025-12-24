
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { curriculum } from '../curriculumData';
import { CustomProblemParams } from '../services/geminiService';
import { LoadingIcon, SparklesIcon, UploadIcon } from './icons';

interface ControlPanelProps {
    onGenerate: (params: CustomProblemParams) => void;
    isGenerating: boolean;
    onUpload: (file: File) => void;
}

const FormInputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">{label}</label>
        {children}
    </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate, isGenerating, onUpload }) => {
    const [educationLevel, setEducationLevel] = useState<'elementary' | 'middle' | 'high'>('high');
    const [subject, setSubject] = useState<string>('공통수학');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [problemCount, setProblemCount] = useState<number>(5);
    const [studentDescription, setStudentDescription] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const subjectOptions = useMemo(() => {
        return Object.keys(curriculum[educationLevel]);
    }, [educationLevel]);

    const topicOptions = useMemo(() => {
        if (!subject) return [];
        return curriculum[educationLevel][subject] || [];
    }, [subject, educationLevel]);
    
    useEffect(() => {
        const firstSubject = subjectOptions[0];
        if (firstSubject && !subjectOptions.includes(subject)) {
            setSubject(firstSubject);
        }
    }, [educationLevel, subjectOptions, subject]);

    // 과목이 바뀌면 선택된 단원 초기화 및 첫 번째 단원 자동 선택 (옵션)
    useEffect(() => {
        if (topicOptions.length > 0) {
            setSelectedTopics([topicOptions[0]]);
        } else {
            setSelectedTopics([]);
        }
    }, [subject, topicOptions]);

    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev => {
            if (prev.includes(topic)) {
                // 최소 1개는 선택되어야 한다면 아래 주석 해제
                // if (prev.length === 1) return prev;
                return prev.filter(t => t !== topic);
            } else {
                return [...prev, topic];
            }
        });
    };

    const handleSelectAll = () => {
        setSelectedTopics(topicOptions);
    };

    const handleDeselectAll = () => {
        setSelectedTopics([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate({
            educationLevel: educationLevel === 'elementary' ? '초등학교' : (educationLevel === 'middle' ? '중학교' : '고등학교'),
            subject: subject,
            topics: selectedTopics,
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
            <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark border-b border-border-light dark:border-border-dark pb-4">맞춤 문제 생성</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                 <FormInputGroup label="과정">
                    <select value={educationLevel} onChange={e => setEducationLevel(e.target.value as 'elementary' | 'middle' | 'high')} disabled={isGenerating} className={selectStyles}>
                        <option value="elementary">초등학교</option>
                        <option value="middle">중학교</option>
                        <option value="high">고등학교</option>
                    </select>
                </FormInputGroup>
                
                <FormInputGroup label="과목">
                     <select value={subject} onChange={e => setSubject(e.target.value)} disabled={isGenerating || !subject} className={selectStyles}>
                        {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </FormInputGroup>

                <FormInputGroup label="단원 (복수 선택 가능)">
                    <div className="flex justify-end space-x-2 mb-2">
                        <button type="button" onClick={handleSelectAll} className="text-xs text-primary hover:underline">전체 선택</button>
                        <button type="button" onClick={handleDeselectAll} className="text-xs text-text-muted-light dark:text-text-muted-dark hover:underline">선택 해제</button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-gray-800/50">
                        {topicOptions.length > 0 ? (
                            topicOptions.map(t => (
                                <label key={t} className="flex items-center space-x-3 p-2 rounded hover:bg-paper-light dark:hover:bg-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedTopics.includes(t)}
                                        onChange={() => toggleTopic(t)}
                                        disabled={isGenerating}
                                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <span className="text-sm font-medium text-text-light dark:text-text-dark">{t}</span>
                                </label>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
                                과목을 먼저 선택해주세요.
                            </div>
                        )}
                    </div>
                </FormInputGroup>

                <FormInputGroup label="문제 수">
                     <input
                        type="number"
                        value={problemCount}
                        onChange={e => setProblemCount(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                        min="1"
                        max="10"
                        disabled={isGenerating}
                        className={selectStyles}
                    />
                </FormInputGroup>

                <FormInputGroup label="학생 맞춤 설명 (선택 사항)">
                    <textarea
                        value={studentDescription}
                        onChange={e => setStudentDescription(e.target.value)}
                        disabled={isGenerating}
                        rows={3}
                        placeholder="예: 개념 설명 위주의 쉬운 문제 요청"
                        className={`${selectStyles} resize-y`}
                    />
                </FormInputGroup>

                <button
                    type="submit"
                    disabled={isGenerating || selectedTopics.length === 0}
                    className="w-full flex items-center justify-center px-6 py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isGenerating ? (
                        <>
                            <LoadingIcon className="w-6 h-6 mr-3 animate-spin" />
                            생성 중...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-6 h-6 mr-3" />
                            맞춤 문제 생성하기
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
                JSON 파일 업로드
            </button>
        </div>
    );
};
