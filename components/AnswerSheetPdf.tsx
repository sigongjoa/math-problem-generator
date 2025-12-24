
import React, { useEffect } from 'react';
import { MathProblem } from '../types';
import { MathRenderer } from './MathRenderer';

interface AnswerSheetPdfProps {
    problems: MathProblem[];
    onRendered: () => void;
}

export const AnswerSheetPdf: React.FC<AnswerSheetPdfProps> = ({ problems, onRendered }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRendered();
        }, 1200); 
        return () => clearTimeout(timer);
    }, [onRendered]);

    const optionLabels = ['①', '②', '③', '④', '⑤'];

    return (
        <div style={{ padding: '20mm', backgroundColor: 'white', color: 'black' }}>
            <section>
                <header style={{ marginBottom: '2rem', borderBottom: '3px solid black', paddingBottom: '0.75rem' }}>
                    <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>정답 및 해설</h1>
                </header>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {problems.map((p, i) => (
                        <div key={`answer-${i}`} style={{ 
                            paddingBottom: '1.5rem', 
                            borderBottom: '1px dashed #ddd', 
                            breakInside: 'avoid',
                            pageBreakInside: 'avoid'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>{i + 1}번 문항</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>정답: {optionLabels[p.correctAnswerIndex]}</span>
                            </div>
                            
                            {p.svgImage && (
                                <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0', opacity: 0.8 }}>
                                    <div style={{ maxWidth: '250px', transform: 'scale(0.9)' }} dangerouslySetInnerHTML={{ __html: p.svgImage }} />
                                </div>
                            )}

                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{ 
                                    display: 'inline-block', 
                                    padding: '2px 10px', 
                                    backgroundColor: '#f3f4f6', 
                                    borderRadius: '15px', 
                                    fontSize: '0.85rem', 
                                    fontWeight: 'bold',
                                    color: '#4b5563',
                                    marginBottom: '0.5rem'
                                }}>
                                    유형: {p.problemType}
                                </span>
                            </div>

                            <div style={{ 
                                padding: '1.2rem', 
                                backgroundColor: '#f9fafb', 
                                borderRadius: '12px', 
                                border: '1px solid #e5e7eb' 
                            }}>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '0.8rem', fontSize: '1rem', color: '#111827' }}>[출제 의도 및 해설]</h4>
                                <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: '#374151' }}>
                                    <MathRenderer text={p.analysis} inline={false} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
