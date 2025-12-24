// This file is new. It contains the SpiderChart component.
import React from 'react';

interface SpiderChartProps {
    scores: number[];
    labels: string[];
    size?: number;
}

const polarToX = (angle: number, radius: number, center: number) => center + radius * Math.cos(angle * Math.PI / 180);
const polarToY = (angle: number, radius: number, center: number) => center + radius * Math.sin(angle * Math.PI / 180);

export const SpiderChart: React.FC<SpiderChartProps> = ({ scores, labels, size = 450 }) => {
    const center = size / 2;
    const maxRadius = size * 0.30;
    const levels = 4;
    const maxValue = 100;

    const numAxes = labels.length;
    if (numAxes === 0) return null;

    const angles = Array.from({ length: numAxes }, (_, i) => -90 + (360 / numAxes) * i);
    
    // Special handling for 2 axes to make it look better
    if (numAxes === 2) {
        angles[0] = -135;
        angles[1] = -45;
    }


    const dataPoints = scores.map((score, i) => {
        const radius = (score / maxValue) * maxRadius;
        return `${polarToX(angles[i], radius, center)},${polarToY(angles[i], radius, center)}`;
    }).join(' ');

    const gridLevels = Array.from({ length: levels }, (_, i) => {
        const radius = maxRadius * ((i + 1) / levels);
        const points = angles.map(angle => 
            `${polarToX(angle, radius, center)},${polarToY(angle, radius, center)}`
        ).join(' ');
        return (
            <g key={`level-${i}`}>
                <polygon
                    points={points}
                    className="fill-none stroke-border-light dark:stroke-border-dark"
                    strokeWidth="1"
                />
            </g>
        );
    });

    const axisLines = angles.map((angle, i) => (
         <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={polarToX(angle, maxRadius, center)}
            y2={polarToY(angle, maxRadius, center)}
            className="stroke-border-light dark:stroke-border-dark"
            strokeWidth="1"
        />
    ));
    
    const labelPoints = angles.map((angle, i) => {
        let yOffset = 0;
        // Adjust y-offset for labels that are close to horizontal to prevent overlap
        if (Math.abs(angle - 0) < 10 || Math.abs(angle - 180) < 10) {
            yOffset = 5;
        }
        return (
            <text
                key={`label-${i}`}
                x={polarToX(angle, maxRadius * 1.25, center)}
                y={polarToY(angle, maxRadius * 1.25, center) + yOffset}
                className="text-[10px] sm:text-xs font-bold fill-text-muted-light dark:fill-text-muted-dark"
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {labels[i]}
            </text>
        );
    });

    const scoreLevels = Array.from({ length: levels }, (_, i) => {
        const value = (maxValue / levels) * (i + 1);
        const radius = maxRadius * ((i + 1) / levels);
        const angle = -45;
        return (
            <text
                key={`score-level-${i}`}
                x={polarToX(angle, radius, center) + 5}
                y={polarToY(angle, radius, center)}
                className="text-[8px] sm:text-[10px] fill-text-muted-light dark:fill-text-muted-dark"
                textAnchor="start"
                dominantBaseline="middle"
            >
                {value}
            </text>
        );
    });

    return (
        <div className="flex justify-center items-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <g>
                    {gridLevels}
                    {axisLines}
                    {labelPoints}
                    {scoreLevels}
                    <polygon
                        points={dataPoints}
                        className="fill-primary/30 dark:fill-primary/40 stroke-primary"
                        strokeWidth="2"
                    />
                     {scores.map((score, i) => {
                        const radius = (score / maxValue) * maxRadius;
                        return (
                            <circle
                                key={`point-${i}`}
                                cx={polarToX(angles[i], radius, center)}
                                cy={polarToY(angles[i], radius, center)}
                                r="3"
                                className="fill-primary"
                            />
                        )
                    })}
                </g>
            </svg>
        </div>
    );
};