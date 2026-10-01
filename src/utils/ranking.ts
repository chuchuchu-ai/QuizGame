import type { RankingEntry } from '../types/quiz';

export const RANKING_KEY = 'quiz40.rankings.v1';
type StorageAccess = Pick<Storage, 'getItem' | 'setItem'>;
export function sortRankings(entries: RankingEntry[]) {
  return [...entries].sort((a, b) => b.score - a.score || Date.parse(a.playedAt) - Date.parse(b.playedAt));
}
function isEntry(value: unknown): value is RankingEntry {
  if (!value || typeof value !== 'object') return false;
  const e = value as RankingEntry;
  return typeof e.id === 'string' && typeof e.nickname === 'string' && e.nickname.trim().length > 0 &&
    e.nickname.length <= 20 && Number.isInteger(e.correctCount) && e.correctCount >= 0 &&
    e.correctCount <= 40 && e.score === e.correctCount * 10 && typeof e.playedAt === 'string' && Number.isFinite(Date.parse(e.playedAt));
}
export function readRankings(storage: StorageAccess = window.localStorage): RankingEntry[] {
  const raw = storage.getItem(RANKING_KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  // 손상된 기록을 조용히 덮어쓰지 않도록 저장 전에도 데이터를 검사합니다.
  if (!Array.isArray(parsed) || !parsed.every(isEntry)) throw new Error('invalid ranking');
  return sortRankings(parsed).slice(0, 100);
}
export function saveRanking(entry: RankingEntry, storage: StorageAccess = window.localStorage) {
  if (!isEntry(entry)) throw new Error('invalid entry');
  const existing = readRankings(storage);
  if (existing.some(row => row.id === entry.id)) return;
  storage.setItem(RANKING_KEY, JSON.stringify(sortRankings([...existing, entry]).slice(0, 100)));
}
