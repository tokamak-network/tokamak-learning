import { categories, problems, type Problem } from "@/data/problems";
import { conceptQuestionTemplates, getConceptQuestionExcluding } from "@/data/concept-questions";
import { analyzeBlankPositions, filterHighQualityPositions, type BlankPosition } from "@/lib/blank-analyzer";
import type { AnswerRecord } from "@/app/daily/DailyClient";

export type CodeQuestion = {
  type: "code";
  id: string;
  category: string;
  code: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
};

export type ConceptQuestion = {
  type: "concept";
  id: string;
  category: string;
  question: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
};

export type ChallengeQuestion = CodeQuestion | ConceptQuestion;

export type ChallengeSet = {
  id: string;
  questions: ChallengeQuestion[];
};

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function extractLearningSummary(description: string): string {
  const match = description.match(/## What you'll learn\n([\s\S]*?)(?=\n## |\n$)/);
  if (!match) return "";
  return match[1].trim().slice(0, 300);
}

export function getMasteredCategories(history: AnswerRecord[]): Set<string> {
  const stats = new Map<string, { correct: number; total: number }>();
  for (const a of history) {
    if (!a.category) continue;
    const s = stats.get(a.category) ?? { correct: 0, total: 0 };
    s.total++;
    if (a.correct) s.correct++;
    stats.set(a.category, s);
  }
  const mastered = new Set<string>();
  for (const [cat, s] of stats) {
    if (s.total >= 3 && s.correct / s.total >= 0.7) {
      mastered.add(cat);
    }
  }
  return mastered;
}

export function pickCurriculumProblems(
  mastered: Set<string>,
  count: number
): Problem[] {
  const allCategoryIds = categories.map((c) => c.id);
  const remaining = allCategoryIds.filter((id) => !mastered.has(id));
  const target = remaining.length > 0 ? remaining : allCategoryIds;
  const candidates = problems.filter((p) => target.includes(p.category));
  
  const shuffled = shuffle(candidates);
  return shuffled.slice(0, count);
}

export function extractBlankPositionsFromProblem(problem: Problem): BlankPosition[] {
  const positions = analyzeBlankPositions(problem.solution);
  return filterHighQualityPositions(positions);
}

function generateCodeQuestionFromProblem(
  problem: Problem,
  position: BlankPosition,
  questionIndex: number
): CodeQuestion {
  const codeWithBlank = position.context.replace(position.answer, "___BLANK___");
  
  const fullCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Quiz {
    ${codeWithBlank.replace(/\n/g, "\n    ")}
}`;

  const distractors = generateDistractors(position);

  return {
    type: "code",
    id: `local-c${questionIndex}`,
    category: problem.category,
    code: fullCode,
    answer: position.answer,
    distractors,
    explanation: `This is based on: ${problem.title}. ${position.explanation}`,
  };
}

function generateDistractors(position: BlankPosition): [string, string, string] {
  const { type, answer } = position;
  
  let distractors: string[];
  
  switch (type) {
    case "keyword":
      distractors = getKeywordDistractors(answer);
      break;
    case "operator":
      distractors = getOperatorDistractors(answer);
      break;
    case "builtin":
      distractors = getBuiltinDistractors(answer);
      break;
    case "type":
      distractors = getTypeDistractors(answer);
      break;
    default:
      distractors = ["wrong1", "wrong2", "wrong3"];
  }
  
  return distractors.slice(0, 3) as [string, string, string];
}

function getKeywordDistractors(answer: string): string[] {
  const keywordGroups: Record<string, string[]> = {
    emit: ["log", "return", "throw"],
    require: ["assert", "revert", "if"],
    revert: ["return", "throw", "require"],
    assert: ["require", "revert", "if"],
    mapping: ["array", "struct", "enum"],
    struct: ["enum", "mapping", "array"],
    event: ["function", "modifier", "error"],
    modifier: ["function", "event", "error"],
    override: ["virtual", "abstract", "static"],
    virtual: ["override", "abstract", "final"],
    public: ["private", "internal", "external"],
    private: ["public", "internal", "external"],
    internal: ["public", "private", "external"],
    external: ["public", "internal", "private"],
    view: ["pure", "payable", ""],
    pure: ["view", "payable", ""],
    payable: ["view", "pure", ""],
    contract: ["library", "interface", "abstract"],
    library: ["contract", "interface", "abstract"],
    interface: ["contract", "library", "abstract"],
    for: ["while", "do", "foreach"],
    while: ["for", "do", "if"],
    break: ["continue", "return", "exit"],
    continue: ["break", "return", "exit"],
    return: ["yield", "throw", "revert"],
    if: ["unless", "when", "switch"],
    else: ["then", "endif", "otherwise"],
    true: ["false", "null", "0"],
    false: ["true", "null", "1"],
  };
  return keywordGroups[answer] || ["keyword1", "keyword2", "keyword3"];
}

function getOperatorDistractors(answer: string): string[] {
  const operatorGroups: Record<string, string[]> = {
    "+": ["-", "*", "/"],
    "-": ["+", "*", "/"],
    "*": ["+", "-", "/"],
    "/": ["+", "-", "*"],
    "%": ["+", "-", "*"],
    "++": ["--", "+=1", "-=1"],
    "--": ["++", "+=1", "-=1"],
    "+=": ["-=", "*=", "/="],
    "-=": ["+=", "*=", "/="],
    "*=": ["+=", "-=", "/="],
    "==": ["!=", "<", ">"],
    "!=": ["==", "<=", ">="],
    ">": [">=", "<", "=="],
    "<": ["<=", ">", "=="],
    ">=": [">", "<=", "=="],
    "<=": ["<", ">=", "=="],
    "&&": ["||", "&", "|"],
    "||": ["&&", "|", "&"],
    "&": ["|", "&&", "||"],
    "|": ["&", "&&", "||"],
  };
  return operatorGroups[answer] || ["op1", "op2", "op3"];
}

function getBuiltinDistractors(answer: string): string[] {
  const builtinGroups: Record<string, string[]> = {
    "msg.sender": ["msg.value", "tx.origin", "block.coinbase"],
    "msg.value": ["msg.sender", "tx.origin", "block.coinbase"],
    "tx.origin": ["msg.sender", "msg.value", "block.coinbase"],
    "block.timestamp": ["block.number", "block.chainid", "block.difficulty"],
    "block.number": ["block.timestamp", "block.chainid", "block.difficulty"],
    "block.chainid": ["block.timestamp", "block.number", "block.difficulty"],
    "block.difficulty": ["block.timestamp", "block.number", "block.gaslimit"],
    "block.gaslimit": ["block.gasleft", "block.difficulty", "block.number"],
    "block.gasleft": ["block.gaslimit", "gasleft()", "msg.gas"],
    "gasleft()": ["block.gasleft", "msg.gas", "tx.gasprice"],
    "msg.gas": ["gasleft()", "block.gasleft", "tx.gasprice"],
    "tx.gasprice": ["msg.gas", "gasleft()", "block.gaslimit"],
    "msg.data": ["msg.sender", "msg.sig", "msg.value"],
    "msg.sig": ["msg.sender", "msg.data", "msg.value"],
    "abi.encode": ["abi.encodePacked", "abi.decode", "abi.encodeWithSelector"],
    "abi.encodePacked": ["abi.encode", "abi.decode", "abi.encodeWithSignature"],
    "type(T).max": ["type(T).min", "type(T).max", "type(T).min"],
    "type(T).min": ["type(T).max", "type(T).min", "type(T).max"],
    "address(this)": ["msg.sender", "tx.origin", "block.coinbase"],
  };
  return builtinGroups[answer] || ["builtin1", "builtin2", "builtin3"];
}

function getTypeDistractors(answer: string): string[] {
  const typeGroups: Record<string, string[]> = {
    "uint256": ["uint128", "uint64", "uint32"],
    "uint": ["uint128", "uint64", "uint32"],
    "uint8": ["uint16", "uint32", "uint256"],
    "uint16": ["uint8", "uint32", "uint256"],
    "uint32": ["uint16", "uint64", "uint256"],
    "uint64": ["uint32", "uint128", "uint256"],
    "uint128": ["uint64", "uint256", "uint32"],
    "int256": ["int128", "int64", "int32"],
    "int": ["int128", "int64", "int32"],
    "int8": ["int16", "int32", "int256"],
    "int16": ["int8", "int32", "int256"],
    "int32": ["int16", "int64", "int256"],
    "int64": ["int32", "int128", "int256"],
    "int128": ["int64", "int256", "int32"],
    "address": ["uint256", "bytes32", "string"],
    "bool": ["uint256", "address", "string"],
    "string": ["address", "bytes", "uint256"],
    "bytes": ["bytes32", "string", "uint256"],
    "bytes32": ["bytes", "string", "address"],
    "byte": ["bytes", "bytes32", "uint8"],
    "memory": ["calldata", "storage", "uint256"],
    "calldata": ["memory", "storage", "uint256"],
    "storage": ["memory", "calldata", "uint256"],
  };
  return typeGroups[answer] || ["type1", "type2", "type3"];
}

export function generateLocalDailyMission(
  history: AnswerRecord[] = [],
  codeQuestionCount: number = 5,
  conceptQuestionCount: number = 5
): ChallengeSet {
  const trimmed = history.slice(-140);
  const wrongAnswers = trimmed.filter((a) => !a.correct);
  const mastered = getMasteredCategories(trimmed);
  
  const curriculumProblems = pickCurriculumProblems(mastered, codeQuestionCount * 2);
  
  const codeQuestions: CodeQuestion[] = [];
  let questionIndex = 1;
  
  for (const problem of curriculumProblems) {
    if (codeQuestions.length >= codeQuestionCount) break;
    
    const positions = extractBlankPositionsFromProblem(problem);
    const shuffledPositions = shuffle(positions);
    
    for (const position of shuffledPositions) {
      if (codeQuestions.length >= codeQuestionCount) break;
      
      const question = generateCodeQuestionFromProblem(problem, position, questionIndex);
      codeQuestions.push(question);
      questionIndex++;
    }
  }
  
  const pastConceptQuestions = trimmed
    .filter((a) => a.type === "concept")
    .map((a) => a.questionId)
    .filter(Boolean);
  
  const conceptTemplates = getConceptQuestionExcluding(conceptQuestionCount, pastConceptQuestions);
  const selectedConceptTemplates = shuffle(conceptTemplates).slice(0, conceptQuestionCount);
  
  const conceptQuestions: ConceptQuestion[] = selectedConceptTemplates.map((template, idx) => ({
    type: "concept" as const,
    id: `local-q${idx + 1}`,
    category: template.category,
    question: template.question,
    answer: template.answer,
    distractors: template.distractors,
    explanation: template.explanation,
  }));
  
  const allQuestions = shuffle([...codeQuestions, ...conceptQuestions]);
  
  return {
    id: `local-${Date.now()}`,
    questions: allQuestions,
  };
}

export function generateLocalCodeQuestions(
  history: AnswerRecord[] = [],
  count: number = 5
): CodeQuestion[] {
  const trimmed = history.slice(-140);
  const mastered = getMasteredCategories(trimmed);
  
  const curriculumProblems = pickCurriculumProblems(mastered, count * 2);
  
  const codeQuestions: CodeQuestion[] = [];
  let questionIndex = 1;
  
  for (const problem of curriculumProblems) {
    if (codeQuestions.length >= count) break;
    
    const positions = extractBlankPositionsFromProblem(problem);
    const shuffledPositions = shuffle(positions);
    
    for (const position of shuffledPositions) {
      if (codeQuestions.length >= count) break;
      
      const question = generateCodeQuestionFromProblem(problem, position, questionIndex);
      codeQuestions.push(question);
      questionIndex++;
    }
  }
  
  return codeQuestions;
}

export function generateLocalConceptQuestions(
  history: AnswerRecord[] = [],
  count: number = 5
): ConceptQuestion[] {
  const trimmed = history.slice(-140);
  
  const pastConceptQuestions = trimmed
    .filter((a) => a.type === "concept")
    .map((a) => a.questionId)
    .filter(Boolean);
  
  const conceptTemplates = getConceptQuestionExcluding(count, pastConceptQuestions);
  const selectedConceptTemplates = shuffle(conceptTemplates).slice(0, count);
  
  return selectedConceptTemplates.map((template, idx) => ({
    type: "concept" as const,
    id: `local-q${idx + 1}`,
    category: template.category,
    question: template.question,
    answer: template.answer,
    distractors: template.distractors,
    explanation: template.explanation,
  }));
}
