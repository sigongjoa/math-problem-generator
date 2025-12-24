import React, { useEffect } from 'react';
import { MathProblem } from '../types';
import { MathRenderer } from './MathRenderer';

interface PdfDocumentProps {
    problems: MathProblem[];
    onRendered: () => void;
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({ problems, onRendered }) => {
    useEffect(() => {
        // Increased timeout to allow MathJax more time to render everything
        // before the PDF capture is triggered. This helps prevent capturing
        // partially rendered or un-rendered math equations.
        const timer = setTimeout(() => {
            onRendered();
        }, 500); 
        return () => clearTimeout(timer);
    }, [onRendered]);

    const optionLabels = ['①', '②', '③', '④', '⑤'];

    return (
        <div style={{ padding: '15mm' }}>
            {/* --- Problem Sheet --- */}
            <section>
                <header style={{ marginBottom: '1rem', borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>
                    <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>AI 생성 맞춤 수학 문제지</h1>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>수학 영역</h2>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>성명: ______________</span>
                    </div>
                </header>
                
                <div>
                    {problems.map((p, i) => (
                        <div key={`problem-${i}`} style={{ 
                            marginBottom: '1.5rem', 
                            breakInside: 'avoid-page',
                        }}>
                            <p style={{ marginBottom: '1rem', fontSize: '1rem', lineHeight: '1.6' }}>
                                <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>{i + 1}.</span>
                                <MathRenderer text={p.question} />
                                <span style={{ marginLeft: '0.5rem' }}>[{p.points}점]</span>
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem 1rem', paddingLeft: '1rem' }}>
                                {p.options.map((option, j) => (
                                    <div key={j} style={{ 
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'baseline'
                                    }}>
                                        <span style={{ marginRight: '0.35rem' }}>{optionLabels[j]}</span>
                                        <MathRenderer text={option} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div style={{ pageBreakBefore: 'always', margin: '0', padding: '0', height: '1px' }}></div>
            
            {/* --- Answer Sheet --- */}
            <section>
                <header style={{ marginBottom: '1rem', borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>
                    <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>정답 및 해설</h1>
                </header>
                <div>
                    {problems.map((p, i) => (
                        <div key={`answer-${i}`} style={{ marginBottom: '1.5rem', borderBottom: '1px dashed #ccc', paddingBottom: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                {i + 1}번 문제 &nbsp; | &nbsp; 정답: {optionLabels[p.correctAnswerIndex]}
                            </p>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#333' }}>
                                <span style={{ fontWeight: 'bold' }}>유형:</span> {p.problemType}
                            </p>
                            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #eee' }}>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>출제 의도 및 분석</h4>
                                <div style={{ fontSize: '0.9rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                                    <MathRenderer text={p.analysis} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};