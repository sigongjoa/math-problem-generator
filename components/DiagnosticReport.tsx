import React, { useState } from 'react';
import { DiagnosticReportData, MainAxisAnalysis, MathProblem } from '../types';
import { SparklesIcon, CognitiveIcon, MetacognitionIcon, KnowledgeIcon, StaminaIcon, ChevronDownIcon, CurriculumIcon } from './icons';
import { SpiderChart } from './SpiderChart';
import { TestResultDetails } from './TestResultDetails';

interface DiagnosticReportProps {
    reportData: DiagnosticReportData;
    problems: MathProblem[];
    answers: (number | null)[];
    isPdfMode?: boolean;
}

const LatentSpaceVisualizer: React.FC<{ scores: DiagnosticReportData['scores'] }> = ({ scores }) => {
    const axisConfigs = [
        {
            title: "인지적 기저",
            Icon: CognitiveIcon,
            labels: ['기하', '해석', '대수'],
            scores: [scores.axis1_geo, scores.axis1_ana, scores.axis1_alg],
            color: 'text-cyan-500'
        },
        {
            title: "전략적 메타인지",
            Icon: MetacognitionIcon,
            labels: ['최적화', '피벗', '자가 진단'],
            scores: [scores.axis2_opt, scores.axis2_piv, scores.axis2_dia],
            color: 'text-amber-500'
        },
        {
            title: "지식의 상태",
            Icon: KnowledgeIcon,
            labels: ['개념적 지식', '절차적 지식', '인출 속도'],
            scores: [scores.axis3_con, scores.axis3_pro, scores.axis3_ret],
            color: 'text-lime-500'
        },
        {
            title: "실행의 지구력",
            Icon: StaminaIcon,
            labels: ['연산 정확성', '난이도 내성'],
            scores: [scores.axis4_acc, scores.axis4_gri],
            color: 'text-rose-500'
        },
        {
            title: "커리큘럼 진도",
            Icon: CurriculumIcon,
            labels: ['전체 진도', '현재 단원', '선수 개념'],
            scores: [scores.axis5_completion, scores.axis5_currentTopicMastery, scores.axis5_foundationalMastery],
            color: 'text-indigo-500'
        }
    ];

    return (
        <div className="bg-paper-light dark:bg-paper-dark p-2 sm:p-6 rounded-lg">
            <h4 className="text-xl font-bold text-center text-text-light dark:text-text-dark mb-2">
                학생의 잠재 공간
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {axisConfigs.map(({ title, Icon, labels, scores, color }, index) => (
                    <div key={title} className={`bg-background-light dark:bg-gray-800/50 rounded-lg border border-border-light dark:border-border-dark p-4 ${index >= 3 ? 'lg:last:col-start-2' : ''}`}>
                        <h5 className={`flex items-center text-center font-bold ${color} mb-2`}>
                            <Icon className="w-5 h-5 mr-2" />
                            {title}
                        </h5>
                        <SpiderChart scores={scores} labels={labels} size={250} />
                    </div>
                ))}
            </div>
        </div>
    );
};


const AxisCard: React.FC<{ title: string; description: string; analysis: MainAxisAnalysis }> = ({ title, description, analysis }) => (
    <div className="bg-background-light dark:bg-gray-800 rounded-lg border border-border-light dark:border-border-dark p-6 flex flex-col h-full">
        <div className="flex-grow">
            <h3 className="text-xl font-bold text-primary">{title}</h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1 mb-4">{description}</p>
            
            <div className="mb-6 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <h4 className="font-semibold text-primary dark:text-blue-300 flex items-center"><SparklesIcon className="w-5 h-5 mr-2" />AI 분석 학생 유형</h4>
                <p className="font-bold mt-1">{analysis.archetype}</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">{analysis.archetypeDescription}</p>
            </div>
            
            <div>
                <h4 className="font-semibold text-text-light dark:text-text-dark mb-2">AI 종합 분석</h4>
                 <div className="text-sm p-3 bg-paper-light dark:bg-gray-700/50 rounded-md border border-border-light dark:border-border-dark">
                    <p className="whitespace-pre-wrap leading-relaxed text-text-muted-light dark:text-text-muted-dark">{analysis.summary}</p>
                </div>
            </div>
        </div>
    </div>
);

export const DiagnosticReport: React.FC<DiagnosticReportProps> = ({ reportData, problems, answers, isPdfMode = false }) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(isPdfMode);
    
    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold text-center text-text-light dark:text-text-dark border-b-2 border-text-light dark:border-text-dark pb-4 mb-2">
                AI 수학 학습 진단 리포트
            </h3>
             <div className="p-4 text-center bg-blue-50 dark:bg-gray-800 rounded-lg mb-6">
                <h4 className="font-bold text-primary mb-2">AI 총평</h4>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark whitespace-pre-wrap">{reportData.overallSummary}</p>
            </div>
            
            {/* Collapsible Test Result Details */}
            <div className="border border-border-light dark:border-border-dark rounded-lg">
                <button
                    onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                    className="w-full flex justify-between items-center p-4 bg-background-light dark:bg-gray-800/50 rounded-t-lg"
                    aria-expanded={isDetailsVisible}
                >
                    <h4 className="font-bold text-primary">문항별 진단 상세 보기 (AI 분석 근거)</h4>
                    <ChevronDownIcon className={`w-6 h-6 text-primary transition-transform duration-300 ${isDetailsVisible ? 'rotate-180' : ''}`} />
                </button>
                {isDetailsVisible && (
                     <div className="p-4 border-t border-border-light dark:border-border-dark">
                        <TestResultDetails problems={problems} answers={answers} />
                    </div>
                )}
            </div>


            <LatentSpaceVisualizer scores={reportData.scores} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <AxisCard 
                    title="축 1: 인지 기저"
                    description="기하, 대수, 해석 등 수학의 기본기를 평가합니다."
                    analysis={reportData.axis1_cognitiveBase}
                />
                <AxisCard 
                    title="축 2: 메타인지"
                    description="자신의 풀이 과정을 돌아보고 더 나은 전략을 찾는 능력을 평가합니다."
                    analysis={reportData.axis2_metacognition}
                />
                <AxisCard 
                    title="축 3: 지식 상태"
                    description="개념과 공식을 얼마나 잘 이해하고 빠르게 사용하는지를 평가합니다."
                    analysis={reportData.axis3_knowledgeState}
                />
                <AxisCard 
                    title="축 4: 실행 지구력"
                    description="복잡한 계산을 정확하게 해내고, 어려운 문제를 포기하지 않는 끈기를 평가합니다."
                    analysis={reportData.axis4_executionStamina}
                />
                <div className="md:col-span-2">
                    <AxisCard 
                        title="축 5: 커리큘럼 진도"
                        description="교육 과정상의 '지식 지도'를 얼마나 정복했는지, 학습 성취도를 평가합니다."
                        analysis={reportData.axis5_curriculumProgress}
                    />
                </div>
            </div>
        </div>
    );
};
