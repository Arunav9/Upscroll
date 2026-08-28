import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StarfieldBackground from '../components/StarfieldBackground';
import { colors } from '../constants/theme';
import { TOPICS, type TopicId } from '../content/topics';
import { getSelectedTopics, setSelectedTopics } from '../services/prefs';

const MIN_TOPICS = 3;

export default function OnboardingScreen() {
  const [selected, setSelected] = useState<Set<TopicId>>(new Set());

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // A quick pop from the center — no slide, just fade + scale up with a
    // slight overshoot so it feels like it springs into place.
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.back(1.6)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, scale]);

  useEffect(() => {
    getSelectedTopics().then((topics) => {
      if (topics.length > 0) setSelected(new Set(topics));
    });
  }, []);

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
    router.replace('/feed');
  };

  return (
    <LinearGradient colors={colors.backgroundGradient} style={styles.container}>
      <StarfieldBackground />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fade, transform: [{ scale }] }}>
            <Text style={styles.title}>What do you want to learn about?</Text>
            <Text style={styles.subtitle}>
              Swap the scroll for something worth remembering. Pick at least{' '}
              {MIN_TOPICS} topics. We&apos;ll turn your feed into fun facts
              instead of noise.
            </Text>

            <View style={styles.grid}>
              {TOPICS.map((topic) => {
                const isSelected = selected.has(topic.id);
                return (
                  <Pressable
                    key={topic.id}
                    onPress={() => toggle(topic.id)}
                    style={({ pressed }) => [
                      styles.chipTouch,
                      pressed && styles.chipPressed,
                    ]}
                  >
                    {isSelected ? (
                      <LinearGradient
                        colors={topic.gradient}
                        style={styles.chip}
                      >
                        <Text style={styles.chipEmoji}>{topic.emoji}</Text>
                        <Text style={styles.chipLabelSelected}>
                          {topic.label}
                        </Text>
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
            {selected.size} selected
            {!canStart
              ? ` · pick ${MIN_TOPICS - selected.size} more`
              : ' · ready to go'}
          </Text>
          <Pressable
            onPress={handleStart}
            disabled={!canStart}
            style={({ pressed }) => [
              pressed && canStart && styles.startButtonPressed,
            ]}
          >
            {canStart ? (
              <LinearGradient
                colors={colors.ctaGradient}
                style={styles.startButton}
              >
                <Text style={styles.startButtonText}>Start learning →</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.startButton, styles.startButtonDisabled]}>
                <Text style={styles.startButtonTextDisabled}>
                  Start learning →
                </Text>
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
  scrollContent: {
    padding: 24,
    paddingTop: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 29,
    letterSpacing: -0.2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  chipTouch: {
    width: '31%',
    borderRadius: 14,
  },
  chipPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  chip: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 14,
  },
  chipUnselected: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chipEmoji: {
    fontSize: 24,
  },
  chipLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  chipLabelSelected: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
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
    shadowColor: colors.ctaShadow,
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
