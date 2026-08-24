import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FactCard from '../components/FactCard';
import { colors } from '../constants/theme';
import { getFeed, type Fact } from '../content/provider';
import {
  addSeenIds,
  getSavedIds,
  getSeenIds,
  getSelectedTopics,
  toggleSavedId,
} from '../services/prefs';

const SESSION_SIZE = 10;

type EndItem = { id: '__session_end__'; isEnd: true };
type FeedItem = Fact | EndItem;

const { height } = Dimensions.get('window');

export default function FeedScreen() {
  const [deck, setDeck] = useState<Fact[] | null>(null);
  const [index, setIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const listRef = useRef<FlatList<FeedItem>>(null);
  const prevIndexRef = useRef(0);

  const loadDeck = useCallback(async () => {
    const [topics, seen, saved] = await Promise.all([
      getSelectedTopics(),
      getSeenIds(),
      getSavedIds(),
    ]);
    const facts = getFeed(topics, seen, SESSION_SIZE);
    setDeck(facts);
    setSavedIds(saved);
    setIndex(0);
    prevIndexRef.current = 0;
    // New deck reuses this same FlatList instance, so its scroll offset
    // needs an explicit reset back to the top of the fresh session.
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, []);

  useEffect(() => {
    loadDeck();
  }, [loadDeck]);

  const handleSave = useCallback(async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = await toggleSavedId(id);
    setSavedIds(next);
  }, []);

  const startMore = useCallback(() => {
    loadDeck();
  }, [loadDeck]);

  const items: FeedItem[] = useMemo(
    () => (deck ? [...deck, { id: '__session_end__', isEnd: true }] : []),
    [deck],
  );

  // Fires continuously while the list is being dragged/decelerated (not just
  // once it settles), so the progress bar tracks the finger instead of
  // jumping only when the page finishes snapping.
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.y / height);
    setIndex((prev) => (prev === newIndex ? prev : newIndex));
  }, []);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!deck) return;
      const newIndex = Math.round(
        event.nativeEvent.contentOffset.y / height,
      );
      const prevIndex = prevIndexRef.current;
      if (newIndex === prevIndex) return;

      if (newIndex > prevIndex) {
        const passed = deck
          .slice(prevIndex, Math.min(newIndex, deck.length))
          .map((f) => f.id);
        if (passed.length) addSeenIds(passed);
      }
      prevIndexRef.current = newIndex;
    },
    [deck],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<FeedItem> | null | undefined, i: number) => ({
      length: height,
      offset: height * i,
      index: i,
    }),
    [],
  );

  const keyExtractor = useCallback((item: FeedItem) => item.id, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FeedItem>) => {
      if ('isEnd' in item) {
        return (
          <View style={[styles.endContainer, { height }]}>
            <Text style={styles.endEmoji}>🎉</Text>
            <Text style={styles.endTitle}>
              You learned {deck?.length ?? 0} things.
            </Text>
            <Text style={styles.endSubtitle}>
              Nice. That&apos;s a session well spent.
            </Text>
            <Pressable style={styles.endButton} onPress={startMore}>
              <Text style={styles.endButtonText}>
                Give me {SESSION_SIZE} more
              </Text>
            </Pressable>
            <Pressable
              style={styles.endButtonSecondary}
              onPress={() => router.replace('/onboarding')}
            >
              <Text style={styles.endButtonSecondaryText}>Back to home</Text>
            </Pressable>
          </View>
        );
      }

      return (
        <Pressable
          style={{ height }}
          onLongPress={() => handleSave(item.id)}
          delayLongPress={350}
        >
          <FactCard fact={item} saved={savedIds.includes(item.id)} />
        </Pressable>
      );
    },
    [deck?.length, handleSave, savedIds, startMore],
  );

  if (!deck) {
    return <View style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressTrack}>
          {deck.map((f, i) => (
            <View
              key={f.id}
              style={[
                styles.progressSegment,
                {
                  backgroundColor:
                    i <= index
                      ? 'rgba(255,255,255,0.9)'
                      : 'rgba(255,255,255,0.25)',
                },
              ]}
            />
          ))}
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.homeButton,
            pressed && styles.homeButtonPressed,
          ]}
          onPress={() => router.replace('/onboarding')}
          hitSlop={8}
        >
          <Text style={styles.homeIcon}>⌂</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={height}
        snapToAlignment="start"
        bounces={false}
        getItemLayout={getItemLayout}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  header: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  homeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  homeIcon: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 16,
  },
  endContainer: {
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
