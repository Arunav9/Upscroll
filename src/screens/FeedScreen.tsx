import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FactCard from '../components/FactCard';
import { colors } from '../constants/theme';
import { getFeed, type Fact } from '../content/provider';
import { addSeenIds, getSavedIds, getSeenIds, getSelectedTopics, toggleSavedId } from '../services/prefs';

const SESSION_SIZE = 10;
const SWIPE_THRESHOLD = 60;

export default function FeedScreen() {
  const [deck, setDeck] = useState<Fact[] | null>(null);
  const [state, setState] = useState({ index: 0, ended: false });
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const { index, ended: sessionEnded } = state;

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const loadDeck = useCallback(async () => {
    const [topics, seen, saved] = await Promise.all([
      getSelectedTopics(),
      getSeenIds(),
      getSavedIds(),
    ]);
    const facts = getFeed(topics, seen, SESSION_SIZE);
    setDeck(facts);
    setSavedIds(saved);
    setState({ index: 0, ended: false });
  }, []);

  useEffect(() => {
    loadDeck();
  }, [loadDeck]);

  const transitioning = useRef(false);

  const runTransition = useCallback(
    (direction: 1 | -1, nextIndexOf: (prev: number) => number) => {
      if (transitioning.current) return;
      transitioning.current = true;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const exitTo = direction === 1 ? -24 : 24;
      const enterFrom = -exitTo;

      Animated.parallel([
        Animated.timing(translateY, { toValue: exitTo, duration: 90, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 90, useNativeDriver: true }),
      ]).start(() => {
        translateY.setValue(enterFrom);
        setState((prev) => {
          const nextIndex = nextIndexOf(prev.index);
          if (deck && direction === 1 && prev.index < deck.length) {
            addSeenIds([deck[prev.index].id]);
          }
          const ended = !!deck && nextIndex >= deck.length;
          return { index: nextIndex, ended };
        });
        // Unlock as soon as the content has swapped, not after the fade-in
        // finishes — lets a fast follow-up tap interrupt the fade-in instead
        // of queuing behind it, which is what makes rapid tapping feel snappy.
        transitioning.current = false;
        Animated.parallel([
          Animated.timing(translateY, { toValue: 0, duration: 130, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 130, useNativeDriver: true }),
        ]).start();
      });
    },
    [deck, translateY, opacity]
  );

  const advance = useCallback(() => {
    runTransition(1, (prev) => prev + 1);
  }, [runTransition]);

  const goBack = useCallback(() => {
    if (index === 0) return;
    runTransition(-1, (prev) => Math.max(prev - 1, 0));
  }, [index, runTransition]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy < -SWIPE_THRESHOLD) {
            advance();
          } else if (gesture.dy > SWIPE_THRESHOLD) {
            goBack();
          }
        },
      }),
    [advance, goBack]
  );

  const handleSave = useCallback(async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = await toggleSavedId(id);
    setSavedIds(next);
  }, []);

  const startMore = useCallback(() => {
    loadDeck();
  }, [loadDeck]);

  if (!deck) {
    return <View style={styles.loading} />;
  }

  if (sessionEnded) {
    return (
      <View style={styles.endContainer}>
        <Text style={styles.endEmoji}>🎉</Text>
        <Text style={styles.endTitle}>You learned {deck.length} things.</Text>
        <Text style={styles.endSubtitle}>Nice. That's a session well spent.</Text>
        <Pressable style={styles.endButton} onPress={startMore}>
          <Text style={styles.endButtonText}>Give me {SESSION_SIZE} more</Text>
        </Pressable>
        <Pressable style={styles.endButtonSecondary} onPress={() => router.replace('/onboarding')}>
          <Text style={styles.endButtonSecondaryText}>Back to home</Text>
        </Pressable>
      </View>
    );
  }

  const current = deck[index];
  if (!current) {
    return <View style={styles.loading} />;
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.progressTrack}>
        {deck.map((f, i) => (
          <View
            key={f.id}
            style={[
              styles.progressSegment,
              { backgroundColor: i <= index ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)' },
            ]}
          />
        ))}
      </View>

      <Animated.View style={[styles.cardWrapper, { opacity, transform: [{ translateY }] }]}>
        <FactCard fact={current} saved={savedIds.includes(current.id)} />
      </Animated.View>

      <View style={styles.tapZones} pointerEvents="box-none">
        <Pressable
          style={styles.tapZoneLeft}
          onPress={goBack}
          onLongPress={() => handleSave(current.id)}
        />
        <Pressable
          style={styles.tapZoneRight}
          onPress={advance}
          onLongPress={() => handleSave(current.id)}
        />
      </View>
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  progressTrack: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    gap: 4,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  tapZones: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
  },
  tapZoneLeft: {
    flex: 1,
  },
  tapZoneRight: {
    flex: 1,
  },
  cardWrapper: {
    flex: 1,
    minHeight: height,
  },
  endContainer: {
    flex: 1,
    backgroundColor: colors.endScreenBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  endEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  endTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  endSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  endButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
  },
  endButtonText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
  endButtonSecondary: {
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  endButtonSecondaryText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
});
