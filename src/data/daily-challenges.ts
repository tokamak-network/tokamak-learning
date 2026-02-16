export type CodeQuestion = {
  type: "code";
  id: string;
  category: string;
  code: string; // contains ___BLANK___ marker
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
