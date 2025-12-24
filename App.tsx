
// Fix: Add type declarations for global libraries to resolve TypeScript errors.
declare global {
    interface Window {
        MathJax?: {
            typesetPromise: (nodes?: HTMLElement[]) => Promise<void>;
        };
        jspdf: {
            jsPDF: new (options?: any) => any;
        };
    }
    const html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
}

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { MathJaxContext } from 'better-react-mathjax';
import { ControlPanel } from './components/ControlPanel';
import { LevelTestControlPanel } from './components/LevelTestControlPanel';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProblemCard } from './components/ProblemCard';
import { ProblemAnalysis } from './components/ProblemAnalysis';
import { DiagnosticReport } from './components/DiagnosticReport';
import { Navigation } from './components/Navigation';
import { ThemeToggle } from './components/ThemeToggle';
import { generateCustomProblems, generateLevelTest, generateDiagnosticReport, CustomProblemParams, LevelTestParams } from './services/geminiService';
import { MathProblem, DiagnosticReportData } from './types';
import { ProblemSheetPdf } from './components/ProblemSheetPdf';
import { AnswerSheetPdf } from './components/AnswerSheetPdf';
import { ReportPdfDocument } from './components/ReportPdfDocument';
import { LoadingIcon, DownloadIcon } from './components/icons';

type PageType = 'generator' | 'levelTest';

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [currentPage, setCurrentPage] = useState<PageType>('generator');
    const [problems, setProblems] = useState<MathProblem[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingProblemPdf, setIsGeneratingProblemPdf] = useState(false);
    const [isGeneratingAnswerPdf, setIsGeneratingAnswerPdf] = useState(false);
    const [isGeneratingReportPdf, setIsGeneratingReportPdf] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Editing state for both problem and analysis
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    
    // State for level test
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [reportData, setReportData] = useState<DiagnosticReportData | null>(null);
    const [studentInfoForReport, setStudentInfoForReport] = useState('');
    const [generationParams, setGenerationParams] = useState<CustomProblemParams | LevelTestParams | null>(null);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        }
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleNavigate = (page: PageType) => {
        if (isGenerating || isGeneratingProblemPdf || isGeneratingAnswerPdf || isGeneratingReportPdf) return;
        setCurrentPage(page);
        resetState();
    };
    
    const resetState = () => {
        setProblems([]);
        setError(null);
        setEditingIndex(null);
        setAnswers([]);
        setIsSubmitted(false);
        setReportData(null);
        setStudentInfoForReport('');
        setGenerationParams(null);
    };

    const handleGenerateProblems = async (params: CustomProblemParams) => {
        setIsGenerating(true);
        resetState();
        setStudentInfoForReport(params.studentDescription);
        setGenerationParams(params);
        try {
            const newProblems = await generateCustomProblems(params);
            setProblems(newProblems);
            setAnswers(new Array(newProblems.length).fill(null));
        } catch (e) {
            console.error(e);
            setError('문제 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateLevelTest = async (params: LevelTestParams) => {
        setIsGenerating(true);
        resetState();
        setStudentInfoForReport(params.studentDescription);
        setGenerationParams(params);
        try {
            const newProblems = await generateLevelTest(params);
            setProblems(newProblems);
            setAnswers(new Array(newProblems.length).fill(null));
        } catch (e) {
            console.error(e);
            setError('진단 테스트 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleProblemUpdate = (index: number, updatedProblem: MathProblem) => {
        const newProblems = [...problems];
        newProblems[index] = updatedProblem;
        setProblems(newProblems);
        setEditingIndex(null);
    };

    const handleAnswerSelect = (problemIndex: number, optionIndex: number) => {
        if (isSubmitted) return;
        const newAnswers = [...answers];
        newAnswers[problemIndex] = optionIndex;
        setAnswers(newAnswers);
    };
    
    const handleSubmitTest = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const report = await generateDiagnosticReport(problems, answers, studentInfoForReport);
            setReportData(report);
            setIsSubmitted(true);
            window.scrollTo(0, 0);
        } catch (e) {
            console.error(e);
            setError('리포트 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUploadJson = (file: File, sourcePage: PageType) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File could not be read as text.");
                }
                const data = JSON.parse(text);
                if (!Array.isArray(data)) throw new Error('Invalid format');
                const loadedProblems = data as MathProblem[];
                resetState();
                setProblems(loadedProblems);
                setAnswers(new Array(loadedProblems.length).fill(null));
                setCurrentPage(sourcePage);
            } catch (err) {
                setError(`JSON 파일 처리 오류: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
            }
        };
        reader.readAsText(file);
    };

    const handleDownloadJson = () => {
        if (problems.length === 0) return;
        const jsonString = JSON.stringify(problems, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${getPdfBaseFilename()}_문제.json`;
        link.click();
    };

    const getPdfBaseFilename = () => {
        if (!generationParams) return 'AI_Math';
        const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9가-힣\s-]/g, '').replace(/[\s/]+/g, '_').trim();
        return sanitize(currentPage === 'generator' ? '맞춤문제' : '진단테스트');
    };

    const generatePdf = async (
        documentComponent: React.ReactElement<any>,
        fileName: string,
        setIsGen: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        if (problems.length === 0) return;
        setIsGen(true);
        
        // PDF 생성을 위한 전용 컨테이너 생성 및 스타일 설정
        const pdfContainer = document.createElement('div');
        Object.assign(pdfContainer.style, {
            position: 'absolute',
            left: '-9999px',
            top: '0',
            width: '210mm', // A4 너비 고정
            backgroundColor: 'white',
            fontFamily: '"Noto Sans KR", sans-serif',
            color: 'black',
        });
        document.body.appendChild(pdfContainer);
        
        const pdfRoot = ReactDOM.createRoot(pdfContainer);
        const mathJaxConfig = { 
            loader: { load: ["input/tex", "output/chtml"] },
            tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] }
        };

        try {
            await new Promise<void>(resolve => {
                 pdfRoot.render(
                    <MathJaxContext config={mathJaxConfig}>
                        {React.cloneElement(documentComponent, { onRendered: resolve })}
                    </MathJaxContext>
                );
            });

            // html2canvas 설정: 고해상도 및 폰트 렌더링 최적화
            const canvas = await html2canvas(pdfContainer, { 
                scale: 2, 
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                onclone: (clonedDoc) => {
                    // 클론된 문서에서 특정 스타일 조정이 필요한 경우 여기서 처리
                    const container = clonedDoc.querySelector('div');
                    if (container) container.style.position = 'relative';
                }
            });

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            const imgWidth = pdfWidth;
            const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;
            
            // 페이지 분할 처리
            let heightLeft = imgHeight;
            let position = 0;
            const imgData = canvas.toDataURL('image/png', 1.0);

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(fileName);
        } catch (err) {
            console.error("PDF generation failed:", err);
            setError("PDF 생성 중 오류가 발생했습니다.");
        } finally {
            pdfRoot.unmount();
            if (document.body.contains(pdfContainer)) {
                document.body.removeChild(pdfContainer);
            }
            setIsGen(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-200 font-sans">
             <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex justify-end mb-4">
                     <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
                <Header pageType={currentPage} />
                <Navigation currentPage={currentPage} onNavigate={handleNavigate} isDisabled={isGenerating} />
                <main className="space-y-8">
                    {error && <div className="bg-red-100 p-3 rounded text-red-700">{error}</div>}
                    {currentPage === 'generator' && problems.length === 0 && <ControlPanel onGenerate={handleGenerateProblems} isGenerating={isGenerating} onUpload={(f) => handleUploadJson(f, 'generator')} />}
                    {currentPage === 'levelTest' && !isSubmitted && problems.length === 0 && <LevelTestControlPanel onGenerate={handleGenerateLevelTest} isGenerating={isGenerating} onUpload={(f) => handleUploadJson(f, 'levelTest')} />}
                    {problems.length > 0 && !reportData && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex flex-wrap justify-end gap-2">
                                <button onClick={handleDownloadJson} className="px-3 py-2 bg-gray-500 text-white rounded text-sm flex items-center"><DownloadIcon className="w-4 h-4 mr-1" /> JSON 저장</button>
                                {currentPage === 'generator' && (
                                    <>
                                        <button 
                                            onClick={() => generatePdf(<ProblemSheetPdf problems={problems} onRendered={() => {}} />, `${getPdfBaseFilename()}_문제지.pdf`, setIsGeneratingProblemPdf)} 
                                            disabled={isGeneratingProblemPdf} 
                                            className="px-3 py-2 bg-blue-500 text-white rounded text-sm flex items-center disabled:bg-blue-300"
                                        >
                                            {isGeneratingProblemPdf ? <LoadingIcon className="w-4 h-4 mr-1 animate-spin" /> : <DownloadIcon className="w-4 h-4 mr-1" />}
                                            문제지 PDF
                                        </button>
                                        <button 
                                            onClick={() => generatePdf(<AnswerSheetPdf problems={problems} onRendered={() => {}} />, `${getPdfBaseFilename()}_해설지.pdf`, setIsGeneratingAnswerPdf)} 
                                            disabled={isGeneratingAnswerPdf} 
                                            className="px-3 py-2 bg-green-600 text-white rounded text-sm flex items-center disabled:bg-green-300"
                                        >
                                            {isGeneratingAnswerPdf ? <LoadingIcon className="w-4 h-4 mr-1 animate-spin" /> : <DownloadIcon className="w-4 h-4 mr-1" />}
                                            해설지 PDF
                                        </button>
                                    </>
                                )}
                            </div>
                            {problems.map((p, i) => (
                                <ProblemCard key={i} problem={p} index={i} isEditing={editingIndex === i} onEdit={() => setEditingIndex(i)} onSave={(up) => handleProblemUpdate(i, up)} onCancel={() => setEditingIndex(null)} isAnyEditing={editingIndex !== null} selectedAnswer={answers[i]} onAnswerSelect={(opt) => handleAnswerSelect(i, opt)} isSubmitted={isSubmitted} />
                            ))}
                            {currentPage === 'generator' && <ProblemAnalysis problems={problems} editingIndex={editingIndex} onEdit={setEditingIndex} onSave={handleProblemUpdate} onCancel={() => setEditingIndex(null)} />}
                            {currentPage === 'levelTest' && !isSubmitted && (
                                <div className="flex flex-col items-center mt-8 space-y-4">
                                    <button onClick={handleSubmitTest} disabled={isGenerating || answers.includes(null)} className="px-8 py-4 bg-primary text-white text-xl font-bold rounded-full shadow-xl hover:bg-blue-600 transition-colors disabled:bg-gray-400">제출 및 분석 결과 보기</button>
                                </div>
                            )}
                            <Footer problemCount={problems.length} />
                        </div>
                    )}
                    {reportData && (
                        <div className="space-y-6">
                            <DiagnosticReport reportData={reportData} problems={problems} answers={answers} />
                        </div>
                    )}
                </main>
             </div>
        </div>
    );
};

export default App;
