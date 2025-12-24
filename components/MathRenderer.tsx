
import React from 'react';
import { MathJax } from 'better-react-mathjax';

interface MathRendererProps {
    text: string;
    className?: string;
    inline?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ text, className, inline = true }) => {
    if (!text) return null;

    // API가 반환하는 문자열에서 실제 줄바꿈 문자를 처리
    // MathJax 컴포넌트 내부에서 문맥에 따라 렌더링하도록 구성
    const processedText = text.replace(/\\n/g, '<br />');

    return (
        <MathJax
            className={className}
            inline={inline}
            dynamic
        >
            <span dangerouslySetInnerHTML={{ __html: processedText }} />
        </MathJax>
    );
};
