import { describe, expect, it } from 'vitest';
import { questions } from '../data/questions';
import { categories } from '../types/quiz';
import { answerQuestion, categoryResults, createGame, nextQuestion } from './quiz';
import { readRankings, saveRanking, sortRankings, RANKING_KEY } from './ranking';

describe('문제은행과 출제', () => {
  it('고유한 50문제, 분야마다 10문제, 보기 5개와 해설을 제공한다', () => {
    expect(questions).toHaveLength(50);
    expect(new Set(questions.map(q => q.id)).size).toBe(50);
    expect(new Set(questions.map(q => q.question.trim())).size).toBe(50);
    for (const category of categories) expect(questions.filter(q => q.category === category)).toHaveLength(10);
    for (const q of questions) {
      expect(categories).toContain(q.category);
      expect(Number.isInteger(q.id)).toBe(true);
      expect(Number.isInteger(q.answer)).toBe(true);
      expect(q.question.trim()).not.toBe('');
      for (const choice of q.choices) expect(choice.trim()).not.toBe('');
      expect(q.choices).toHaveLength(5); expect(new Set(q.choices).size).toBe(5);
      expect(q.answer).toBeGreaterThanOrEqual(0); expect(q.answer).toBeLessThan(5);
      expect(q.explanation.length).toBeGreaterThan(10);
    }
  });
  it('수학 문제의 모든 보기를 계산하여 정답이 하나인지 확인한다', () => {
    // 텍스트 구조 검사로 알 수 없는 수학적 정답은 별도로 계산합니다.
    const prime = questions.find(q => q.id === 37)!;
    const isPrime = (n: number) => n >= 2 && !Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).some(d => n % d === 0);
    expect(prime.choices.map(Number).map(isPrime)).toEqual(prime.choices.map((_, i) => i === prime.answer));
    const leap = questions.find(q => q.id === 40)!;
    const actual = leap.choices.map(choice => Number.parseInt(choice)).map(year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    expect(actual).toEqual(leap.choices.map((_, i) => i === leap.answer));
  });
  it('100번의 게임 모두 중복 없이 분야별 8문제씩 출제한다', () => {
    const orders = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const game = createGame(questions);
      expect(game.questions).toHaveLength(40);
      expect(new Set(game.questions.map(q => q.id)).size).toBe(40);
      for (const category of categories) expect(game.questions.filter(q => q.category === category)).toHaveLength(8);
      orders.add(game.questions.map(q => q.id).join(','));
    }
    expect(orders.size).toBeGreaterThan(1);
  });
});
describe('채점과 진행', () => {
  it.each([0, 20, 40])('%i개 정답을 정확히 합산하고 중복 입력을 무시한다', correctCount => {
    let game = createGame(questions);
    for (let i = 0; i < 40; i++) {
      const q = game.questions[i];
      expect(nextQuestion(game, q.id)).toBe(game);
      game = answerQuestion(game, q.id, i < correctCount ? q.answer : (q.answer + 1) % 5);
      expect(answerQuestion(game, q.id, q.answer)).toBe(game);
      game = nextQuestion(game, q.id);
      expect(nextQuestion(game, q.id)).toBe(game);
    }
    expect(game.answers).toHaveLength(40); expect(game.score).toBe(correctCount * 10);
    expect(game.correctCount).toBe(correctCount);
    expect(categoryResults(game).reduce((sum, row) => sum + row.correct, 0)).toBe(correctCount);
  });
});
describe('랭킹 저장', () => {
  const entry = { id: 'one', nickname: '퀴즈왕', score: 320, correctCount: 32, playedAt: '2026-10-01T01:00:00Z' };
  it('점수순과 동점의 등록 시간순으로 정렬한다', () => {
    const rows = sortRankings([{ ...entry, id: 'later', playedAt: '2026-10-02T01:00:00Z' }, entry, { ...entry, id: 'best', score: 400, correctCount: 40 }]);
    expect(rows.map(row => row.id)).toEqual(['best', 'one', 'later']);
  });
  it('저장 후 복원하고 같은 게임의 중복 등록을 방지한다', () => {
    const memory = new Map<string, string>();
    const storage = { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => { memory.set(key, value); } };
    saveRanking(entry, storage); saveRanking(entry, storage);
    expect(readRankings(storage)).toEqual([entry]);
    memory.set(RANKING_KEY, 'broken');
    expect(() => saveRanking(entry, storage)).toThrow();
    expect(memory.get(RANKING_KEY)).toBe('broken');
  });
  it('저장 권한이 없으면 실패를 알린다', () => {
    const storage = { getItem: () => null, setItem: () => { throw new Error('blocked'); } };
    expect(() => saveRanking(entry, storage)).toThrow('blocked');
  });
});
