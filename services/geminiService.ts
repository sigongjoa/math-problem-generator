
import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem, DiagnosticReportData } from '../types';
import { curriculum } from '../curriculumData';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface CustomProblemParams {
    educationLevel: string;
    subject: string;
    topics: string[]; 
    problemCount: number;
    studentDescription: string;
}

export interface LevelTestParams {
    educationLevel: string;
    subjects: string[]; 
    studentDescription: string;
    problemCount: number;
}

const mathProblemSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING, description: 'The math problem question text.' },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'An array of 5 multiple-choice options.'
        },
        correctAnswerIndex: { type: Type.INTEGER, description: 'The 0-based index of the correct answer in the options array.' },
        points: { type: Type.INTEGER, description: 'The point value of the problem (e.g., 2, 3, or 4).' },
        problemType: { type: Type.STRING, description: 'A short classification of the problem type (e.g., "개념 이해", "계산 능력", "응용 문제").' },
        analysis: { type: Type.STRING, description: 'A detailed solution and analysis.' },
        svgImage: { type: Type.STRING, description: 'Optional SVG code for geometry or graphs. Ensure it has a white background and proper viewBox.' },
    },
    required: ['question', 'options', 'correctAnswerIndex', 'points', 'problemType', 'analysis'],
};

const problemSetSchema = {
    type: Type.OBJECT,
    properties: {
        problems: {
            type: Type.ARRAY,
            items: mathProblemSchema,
        },
    },
    required: ['problems'],
};

const diagnosticReportSchema = {
    type: Type.OBJECT,
    properties: {
        scores: {
            type: Type.OBJECT,
            properties: {
                axis1_geo: { type: Type.INTEGER },
                axis1_alg: { type: Type.INTEGER },
                axis1_ana: { type: Type.INTEGER },
                axis2_opt: { type: Type.INTEGER },
                axis2_piv: { type: Type.INTEGER },
                axis2_dia: { type: Type.INTEGER },
                axis3_con: { type: Type.INTEGER },
                axis3_pro: { type: Type.INTEGER },
                axis3_ret: { type: Type.INTEGER },
                axis4_acc: { type: Type.INTEGER },
                axis4_gri: { type: Type.INTEGER },
                axis5_completion: { type: Type.INTEGER },
                axis5_currentTopicMastery: { type: Type.INTEGER },
                axis5_foundationalMastery: { type: Type.INTEGER },
            },
            required: [
                'axis1_geo', 'axis1_alg', 'axis1_ana', 
                'axis2_opt', 'axis2_piv', 'axis2_dia', 
                'axis3_con', 'axis3_pro', 'axis3_ret', 
                'axis4_acc', 'axis4_gri',
                'axis5_completion', 'axis5_currentTopicMastery', 'axis5_foundationalMastery'
            ]
        },
        axis1_cognitiveBase: {
            type: Type.OBJECT,
            properties: { archetype: { type: Type.STRING }, archetypeDescription: { type: Type.STRING }, summary: { type: Type.STRING } },
            required: ['archetype', 'archetypeDescription', 'summary']
        },
        axis2_metacognition: {
            type: Type.OBJECT,
            properties: { archetype: { type: Type.STRING }, archetypeDescription: { type: Type.STRING }, summary: { type: Type.STRING } },
            required: ['archetype', 'archetypeDescription', 'summary']
        },
        axis3_knowledgeState: {
            type: Type.OBJECT,
            properties: { archetype: { type: Type.STRING }, archetypeDescription: { type: Type.STRING }, summary: { type: Type.STRING } },
            required: ['archetype', 'archetypeDescription', 'summary']
        },
        axis4_executionStamina: {
            type: Type.OBJECT,
            properties: { archetype: { type: Type.STRING }, archetypeDescription: { type: Type.STRING }, summary: { type: Type.STRING } },
            required: ['archetype', 'archetypeDescription', 'summary']
        },
        axis5_curriculumProgress: {
            type: Type.OBJECT,
            properties: { archetype: { type: Type.STRING }, archetypeDescription: { type: Type.STRING }, summary: { type: Type.STRING } },
            required: ['archetype', 'archetypeDescription', 'summary']
        },
        overallSummary: { type: Type.STRING },
    },
    required: ['scores', 'axis1_cognitiveBase', 'axis2_metacognition', 'axis3_knowledgeState', 'axis4_executionStamina', 'axis5_curriculumProgress', 'overallSummary']
};


export const generateCustomProblems = async (params: CustomProblemParams): Promise<MathProblem[]> => {
    const topicsText = params.topics.join(', ');
    
    const prompt = `
        수학 문제지 생성을 위한 지침:
        1. 교육 과정: ${params.educationLevel}
        2. 과목/단원: ${params.subject} / ${topicsText}
        3. 문제 수: ${params.problemCount}
        4. 학생 수준: ${params.studentDescription || '일반'}

        [렌더링 및 레이아웃 지침]
        - 모든 수식은 KaTeX 형식 ($...$ 또는 $$...$$)을 사용하세요.
        - 수식 내부의 연산 기호(+, -, x, ÷) 전후에 적절한 공백을 넣어 가독성을 높이세요.
        - 기하, 그래프, 또는 표가 필요한 문제의 경우 'svgImage' 필드에 SVG 코드를 작성하세요.
        - SVG는 반드시 viewBox="0 0 W H" 속성을 포함하고, 내부 요소가 캔버스를 벗어나지 않도록 여백(padding)을 충분히 확보하세요.
        - SVG 배경은 투명하거나 흰색이어야 하며, 텍스트가 포함될 경우 font-family="Noto Sans KR"을 사용하세요.

        [문제 구성]
        각 문제는 question, options(5개), correctAnswerIndex(0-4), points, problemType, analysis, svgImage를 포함한 JSON이어야 합니다.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: problemSetSchema,
        },
    });

    return JSON.parse(response.text.trim()).problems;
};

export const generateLevelTest = async (params: LevelTestParams): Promise<MathProblem[]> => {
    const subjectsText = params.subjects.join(', ');
    
    const prompt = `
        '5축 역량 모델' 기반 수학 진단 테스트 생성 지침:
        1. 대상: ${params.educationLevel} (${subjectsText})
        2. 문제 수: ${params.problemCount}개
        3. 지침: 각 문항은 인지기저, 메타인지, 지식상태, 실행지구력, 커리큘럼 성취도를 다각도로 측정할 수 있도록 구성하세요.
        
        [레이아웃 주의사항]
        - 수식은 반드시 $...$로 감싸고, 복잡한 식은 $$...$$를 사용하세요.
        - 그림이나 그래프가 필요한 경우 SVG 코드를 생성하여 svgImage 필드에 담으세요. 
        - SVG 코드 생성 시 요소가 겹치거나 잘리지 않도록 좌표 계산에 주의하세요.

        결과는 question, options, correctAnswerIndex, points, problemType, analysis, svgImage 필드를 포함하는 JSON 객체 배열입니다.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: problemSetSchema,
        },
    });

    return JSON.parse(response.text.trim()).problems;
};

export const generateDiagnosticReport = async (
    problems: MathProblem[],
    answers: (number | null)[],
    studentDescription: string
): Promise<DiagnosticReportData> => {
    const problemResults = problems.map((p, i) => ({
        question: p.question,
        isCorrect: p.correctAnswerIndex === answers[i],
        analysis: p.analysis
    }));

    const prompt = `
        수학 문제 풀이 분석 및 진단 리포트 생성:
        - 학생 배경: ${studentDescription}
        - 풀이 결과: ${JSON.stringify(problemResults)}

        지정된 5축 모델에 따라 각 영역별 성취도를 점수화하고 상세 분석을 제공하세요. 
        학부모에게 전달할 메시지이므로 정중하고 격려하는 어조를 사용하세요.
        반드시 지정된 JSON 스키마를 준수하여 결과를 반환하세요.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: diagnosticReportSchema,
        },
    });

    return JSON.parse(response.text.trim());
};
