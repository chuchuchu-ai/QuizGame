export const categories = ['한국사', '과학', '지리', '일반상식', '세계사'] as const;
export type Category = typeof categories[number];
export interface Question {
  id: number;
  category: Category;
  question: string;
  choices: [string, string, string, string, string];
  answer: number;
  explanation: string;
}
export interface UserAnswer { questionId: number; choice: number; correct: boolean }
export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: UserAnswer[];
  score: number;
  correctCount: number;
}
export interface RankingEntry {
  id: string;
  nickname: string;
  score: number;
  correctCount: number;
  playedAt: string;
}
