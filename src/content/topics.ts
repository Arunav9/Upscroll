export type TopicId =
  | 'space'
  | 'body'
  | 'history'
  | 'animals'
  | 'psychology'
  | 'tech'
  | 'food'
  | 'money'
  | 'language'
  | 'ocean';

export interface Topic {
  id: TopicId;
  label: string;
  emoji: string;
  gradient: [string, string];
}

export const TOPICS: Topic[] = [
  { id: 'space', label: 'Space', emoji: '🪐', gradient: ['#1e1b4b', '#4338ca'] },
  { id: 'body', label: 'Human Body', emoji: '🫀', gradient: ['#7f1d1d', '#dc2626'] },
  { id: 'history', label: 'History', emoji: '🏛️', gradient: ['#451a03', '#b45309'] },
  { id: 'animals', label: 'Animals', emoji: '🦉', gradient: ['#052e16', '#16a34a'] },
  { id: 'psychology', label: 'Psychology', emoji: '🧠', gradient: ['#3b0764', '#9333ea'] },
  { id: 'tech', label: 'Tech & AI', emoji: '🤖', gradient: ['#082f49', '#0284c7'] },
  { id: 'food', label: 'Food Science', emoji: '🍳', gradient: ['#431407', '#ea580c'] },
  { id: 'money', label: 'Money', emoji: '💸', gradient: ['#052e16', '#059669'] },
  { id: 'language', label: 'Language', emoji: '🗣️', gradient: ['#4c0519', '#e11d48'] },
  { id: 'ocean', label: 'Ocean', emoji: '🌊', gradient: ['#082f49', '#0891b2'] },
];

export function getTopic(id: TopicId): Topic {
  const topic = TOPICS.find((t) => t.id === id);
  if (!topic) throw new Error(`Unknown topic: ${id}`);
  return topic;
}
