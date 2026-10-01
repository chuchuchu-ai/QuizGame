import { categories, type Question, type QuizState } from '../types/quiz';

export const QUESTIONS_PER_CATEGORY = 8;
export const TOTAL_QUESTIONS = 40;
export const POINTS = 10;

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  // 원본 문제은행을 유지하며 각 자리에 올 항목을 동일한 확률로 고릅니다.
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createGame(bank: Question[]): QuizState {
  const questions = shuffle(categories.flatMap(category => {
    const pool = bank.filter(q => q.category === category);
    if (pool.length < QUESTIONS_PER_CATEGORY) throw new Error('문제 수가 부족합니다.');
    return shuffle(pool).slice(0, QUESTIONS_PER_CATEGORY);
  }));
  return { questions, currentQuestionIndex: 0, answers: [], score: 0, correctCount: 0 };
}

export function answerQuestion(state: QuizState, questionId: number, choice: number): QuizState {
  const question = state.questions[state.currentQuestionIndex];
  // 빠른 연속 클릭과 이미 지나간 문제에서 온 입력도 점수를 중복 반영하지 않습니다.
  if (!question || question.id !== questionId || state.answers.length !== state.currentQuestionIndex ||
      !Number.isInteger(choice) || choice < 0 || choice >= question.choices.length) return state;
  const correct = choice === question.answer;
  return { ...state, answers: [...state.answers, { questionId, choice, correct }],
    score: state.score + (correct ? POINTS : 0), correctCount: state.correctCount + Number(correct) };
}

export function nextQuestion(state: QuizState, questionId: number): QuizState {
  if (state.questions[state.currentQuestionIndex]?.id !== questionId ||
      state.answers.length !== state.currentQuestionIndex + 1 ||
      state.currentQuestionIndex >= state.questions.length - 1) return state;
  return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };
}

export function categoryResults(state: QuizState) {
  return categories.map(category => ({ category,
    total: state.questions.filter(q => q.category === category).length,
    correct: state.answers.filter(a => a.correct && state.questions.some(q => q.id === a.questionId && q.category === category)).length,
  }));
}
