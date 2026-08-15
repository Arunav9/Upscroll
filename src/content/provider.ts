import factsData from './facts.json';
import type { TopicId } from './topics';

export interface Fact {
  id: string;
  topic: TopicId;
  title: string;
  body: string;
  source: string;
}

const ALL_FACTS = factsData as Fact[];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Builds a shuffled feed of facts from the selected topics, preferring
 * unseen facts first. If every fact from the selected topics has been
 * seen, the deck reshuffles and reuses them so the feed never dead-ends.
 */
export function getFeed(topics: TopicId[], seenIds: string[], count: number): Fact[] {
  const pool = ALL_FACTS.filter((f) => topics.includes(f.topic));
  if (pool.length === 0) return [];

  const seen = new Set(seenIds);
  const unseen = shuffle(pool.filter((f) => !seen.has(f.id)));
  const alreadySeen = shuffle(pool.filter((f) => seen.has(f.id)));

  return [...unseen, ...alreadySeen].slice(0, count);
}

export function getFactById(id: string): Fact | undefined {
  return ALL_FACTS.find((f) => f.id === id);
}
