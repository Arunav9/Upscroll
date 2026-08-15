import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TopicId } from '../content/topics';

const KEYS = {
  topics: 'nds:topics',
  seen: 'nds:seenIds',
  saved: 'nds:savedIds',
  onboarded: 'nds:onboarded',
} as const;

export async function getSelectedTopics(): Promise<TopicId[]> {
  const raw = await AsyncStorage.getItem(KEYS.topics);
  return raw ? JSON.parse(raw) : [];
}

export async function setSelectedTopics(topics: TopicId[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.topics, JSON.stringify(topics));
}

export async function getSeenIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEYS.seen);
  return raw ? JSON.parse(raw) : [];
}

export async function addSeenIds(ids: string[]): Promise<void> {
  const existing = await getSeenIds();
  const merged = Array.from(new Set([...existing, ...ids]));
  await AsyncStorage.setItem(KEYS.seen, JSON.stringify(merged));
}

export async function getSavedIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEYS.saved);
  return raw ? JSON.parse(raw) : [];
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
