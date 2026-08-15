import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TOPICS, type TopicId } from '../src/content/topics';
import { setOnboarded, setSelectedTopics } from '../src/storage/prefs';

const MIN_TOPICS = 3;

export default function Onboarding() {
  const [selected, setSelected] = useState<Set<TopicId>>(new Set());

  const toggle = (id: TopicId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const canStart = selected.size >= MIN_TOPICS;

  const handleStart = async () => {
    if (!canStart) return;
    await setSelectedTopics(Array.from(selected));
    await setOnboarded(true);
    router.replace('/feed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>What do you want to learn about?</Text>
        <Text style={styles.subtitle}>
          Pick at least {MIN_TOPICS} topics. We'll turn your feed into fun facts instead of noise.
        </Text>

        <View style={styles.grid}>
          {TOPICS.map((topic) => {
            const isSelected = selected.has(topic.id);
            return (
              <Pressable
                key={topic.id}
                onPress={() => toggle(topic.id)}
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                <Text style={styles.chipEmoji}>{topic.emoji}</Text>
                <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                  {topic.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.counter}>
          {selected.size} selected{!canStart ? ` (pick ${MIN_TOPICS - selected.size} more)` : ''}
        </Text>
        <Pressable
          style={[styles.startButton, !canStart && styles.startButtonDisabled]}
          onPress={handleStart}
          disabled={!canStart}
        >
          <Text style={styles.startButtonText}>Start learning</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 32,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chipSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontWeight: '600',
  },
  chipLabelSelected: {
    color: '#0f172a',
  },
  footer: {
    padding: 24,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  counter: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  startButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
});
