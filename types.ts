
// This file was empty. Adding type definitions used across the application.
export interface MathProblem {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    points: number;
    problemType: string;
    analysis: string;
    svgImage?: string; // 도형이나 그래프를 위한 SVG 코드
}

// Detailed scores for each sub-axis based on the new 5-axis model
export interface SubAxisScores {
    // Axis 1: 인지 기저 (Cognitive Base)
    axis1_geo: number; // 기하
    axis1_alg: number; // 대수
    axis1_ana: number; // 해석
    // Axis 2: 메타인지 (Metacognition)
    axis2_opt: number; // 최적화
    axis2_piv: number; // 피벗
    axis2_dia: number; // 자가 진단
    // Axis 3: 지식 상태 (Knowledge State)
    axis3_con: number; // 개념적 지식
    axis3_pro: number; // 절차적 지식
    axis3_ret: number; // 인출 속도
    // Axis 4: 실행 지구력 (Execution Stamina)
    axis4_acc: number; // 연산 정확성
    axis4_gri: number; // 난이도 내성
    // Axis 5: 커리큘럼 진도 (Curriculum Progress)
    axis5_completion: number;       // 전체 진도 달성률
    axis5_currentTopicMastery: number; // 현재 단원 숙련도
    axis5_foundationalMastery: number; // 선수 개념 숙련도
}

// Analysis for each of the 5 main axes
export interface MainAxisAnalysis {
    archetype: string;
    archetypeDescription: string;
    summary: string;
}

export interface DiagnosticReportData {
    scores: SubAxisScores;
    axis1_cognitiveBase: MainAxisAnalysis;
    axis2_metacognition: MainAxisAnalysis;
    axis3_knowledgeState: MainAxisAnalysis;
    axis4_executionStamina: MainAxisAnalysis;
    axis5_curriculumProgress: MainAxisAnalysis;
    overallSummary: string;
}
