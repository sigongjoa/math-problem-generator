
import React, { useEffect } from 'react';
import { MathProblem } from '../types';
import { MathRenderer } from './MathRenderer';

interface ProblemSheetPdfProps {
    problems: MathProblem[];
    onRendered: () => void;
}

export const ProblemSheetPdf: React.FC<ProblemSheetPdfProps> = ({ problems, onRendered }) => {
    useEffect(() => {
        // MathJax 렌더링이 완료될 때까지 충분한 시간을 기다림 (800ms -> 1200ms)
        const timer = setTimeout(() => {
            onRendered();
        }, 1200); 
        return () => clearTimeout(timer);
    }, [onRendered]);

    const optionLabels = ['①', '②', '③', '④', '⑤'];

    return (
        <div style={{ padding: '20mm', backgroundColor: 'white', color: 'black', minHeight: '297mm' }}>
            <section>
                <header style={{ marginBottom: '2rem', borderBottom: '3px solid black', paddingBottom: '0.75rem' }}>
                    <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>AI 생성 맞춤 수학 문제지</h1>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ border: '2px solid black', borderRadius: '20px', padding: '2px 15px', marginRight: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>제 2 교시</div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, letterSpacing: '0.5rem' }}>수학 영역</h2>
                        </div>
                        <span style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>성명: __________________</span>
                    </div>
                </header>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {problems.map((p, i) => (
                        <div key={`problem-${i}`} style={{ 
                            breakInside: 'avoid',
                            pageBreakInside: 'avoid',
                            position: 'relative'
                        }}>
                            <div style={{ marginBottom: '1.2rem', fontSize: '1.1rem', lineHeight: '1.7', textAlign: 'justify' }}>
                                <span style={{ fontWeight: 'bold', marginRight: '0.6rem', fontSize: '1.2rem' }}>{i + 1}.</span>
                                <MathRenderer text={p.question} />
                                <span style={{ marginLeft: '0.6rem', color: '#666', fontSize: '0.9rem' }}>[{p.points}점]</span>
                            </div>

                            {p.svgImage && (
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    margin: '1.5rem 0',
                                    padding: '1rem',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '12px',
                                    backgroundColor: '#fafafa'
                                }}>
                                    <div 
                                        style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
                                        dangerouslySetInnerHTML={{ __html: p.svgImage }} 
                                    />
                                </div>
                            )}

                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(1, 1fr)', 
                                gap: '0.8rem', 
                                paddingLeft: '1.5rem',
                                marginTop: '1rem'
                            }}>
                                {p.options.map((option, j) => (
                                    <div key={j} style={{ 
                                        fontSize: '1rem',
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        lineHeight: '1.4'
                                    }}>
                                        <span style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>{optionLabels[j]}</span>
                                        <MathRenderer text={option} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
