import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TopicId } from '../content/topics';

const KEYS = {
  topics: 'upscroll:topics',
  seen: 'upscroll:seenIds',
  saved: 'upscroll:savedIds',
  onboarded: 'upscroll:onboarded',
} as const;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(
      `[prefs] Corrupted value for "${key}", falling back to default.`,
      error,
    );
    return fallback;
  }
}

export async function getSelectedTopics(): Promise<TopicId[]> {
  return readJson<TopicId[]>(KEYS.topics, []);
}

export async function setSelectedTopics(topics: TopicId[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.topics, JSON.stringify(topics));
}

export async function getSeenIds(): Promise<string[]> {
  return readJson<string[]>(KEYS.seen, []);
}

export async function addSeenIds(ids: string[]): Promise<void> {
  const existing = await getSeenIds();
  const merged = Array.from(new Set([...existing, ...ids]));
  await AsyncStorage.setItem(KEYS.seen, JSON.stringify(merged));
}

export async function getSavedIds(): Promise<string[]> {
  return readJson<string[]>(KEYS.saved, []);
}

export async function toggleSavedId(id: string): Promise<string[]> {
  const existing = await getSavedIds();
  const next = existing.includes(id)
    ? existing.filter((x) => x !== id)
    : [...existing, id];
  await AsyncStorage.setItem(KEYS.saved, JSON.stringify(next));
  return next;
}

export async function isOnboarded(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.onboarded);
  return raw === 'true';
}

export async function setOnboarded(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.onboarded, value ? 'true' : 'false');
}
