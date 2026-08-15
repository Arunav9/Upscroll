import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TOPICS, type TopicId } from '../src/content/topics';
import { setOnboarded, setSelectedTopics } from '../src/storage/prefs';

const MIN_TOPICS = 3;

export default function Onboarding() {
  const [selected, setSelected] = useState<Set<TopicId>>(new Set());

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

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
    <LinearGradient colors={['#020617', '#0b1748', '#1d3fa8']} style={styles.container}>
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowBottom]} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fade, transform: [{ translateY: rise }] }}>
            <View style={styles.brand}>
              <Text style={styles.brandEmoji}>🌠</Text>
              <Text style={styles.brandName}>Upscroll</Text>
            </View>
            <Text style={styles.tagline}>Swap the scroll for something worth remembering.</Text>

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
                    style={({ pressed }) => [styles.chipTouch, pressed && styles.chipPressed]}
                  >
                    {isSelected ? (
                      <LinearGradient colors={topic.gradient} style={styles.chip}>
                        <Text style={styles.chipEmoji}>{topic.emoji}</Text>
                        <Text style={styles.chipLabelSelected}>{topic.label}</Text>
                        <Text style={styles.checkMark}>✓</Text>
                      </LinearGradient>
                    ) : (
                      <View style={[styles.chip, styles.chipUnselected]}>
                        <Text style={styles.chipEmoji}>{topic.emoji}</Text>
                        <Text style={styles.chipLabel}>{topic.label}</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.counter}>
            {selected.size} selected{!canStart ? ` · pick ${MIN_TOPICS - selected.size} more` : ' · ready to go'}
          </Text>
          <Pressable
            onPress={handleStart}
            disabled={!canStart}
            style={({ pressed }) => [pressed && canStart && styles.startButtonPressed]}
          >
            {canStart ? (
              <LinearGradient colors={['#38bdf8', '#3b82f6', '#6366f1']} style={styles.startButton}>
                <Text style={styles.startButtonText}>Start learning →</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.startButton, styles.startButtonDisabled]}>
                <Text style={styles.startButtonTextDisabled}>Start learning →</Text>
              </View>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 320,
  },
  glowTop: {
    top: -140,
    right: -100,
    backgroundColor: 'rgba(96,165,250,0.22)',
  },
  glowBottom: {
    bottom: -160,
    left: -120,
    backgroundColor: 'rgba(99,102,241,0.18)',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  brandEmoji: {
    fontSize: 22,
  },
  brandName: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tagline: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginBottom: 28,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 36,
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
  chipTouch: {
    borderRadius: 999,
  },
  chipPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
  chipUnselected: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.14)',
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
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 2,
  },
  footer: {
    padding: 24,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  counter: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    textAlign: 'center',
  },
  startButton: {
    paddingVertical: 17,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  startButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  startButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    shadowOpacity: 0,
    elevation: 0,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  startButtonTextDisabled: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '700',
  },
});
