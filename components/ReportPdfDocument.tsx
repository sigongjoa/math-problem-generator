import React, { useEffect } from 'react';
import { DiagnosticReportData, MathProblem } from '../types';
import { DiagnosticReport } from './DiagnosticReport';

interface ReportPdfDocumentProps {
    reportData: DiagnosticReportData;
    problems: MathProblem[];
    answers: (number | null)[];
    isPdfMode: boolean;
    onRendered: () => void;
}

export const ReportPdfDocument: React.FC<ReportPdfDocumentProps> = ({ reportData, problems, answers, isPdfMode, onRendered }) => {
    useEffect(() => {
        // Wait for MathJax and chart animations to complete before triggering PDF generation.
        const timer = setTimeout(() => {
            if (window.MathJax) {
                window.MathJax.typesetPromise().then(() => {
                    // Additional delay after typesetting to ensure layout is stable
                    setTimeout(onRendered, 500);
                }).catch(err => {
                    console.error("MathJax typesetting failed:", err);
                    // Still attempt to render after a delay
                    setTimeout(onRendered, 500);
                });
            } else {
                 setTimeout(onRendered, 1000);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [reportData, onRendered]);

    return (
        // The outer div in App.tsx handles the .light class and base styling for PDF.
        // We just render the report component directly.
         <div style={{ backgroundColor: 'white', padding: '1rem' }}>
            <DiagnosticReport 
                reportData={reportData} 
                problems={problems}
                answers={answers}
                isPdfMode={isPdfMode}
            />
        </div>
    );
};