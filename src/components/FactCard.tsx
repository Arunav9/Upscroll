import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import type { Fact } from '../content/provider';
import { getTopic } from '../content/topics';

interface Props {
  fact: Fact;
  saved?: boolean;
}

export default function FactCard({ fact, saved }: Props) {
  const topic = getTopic(fact.topic);

  return (
    <LinearGradient colors={topic.gradient} style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.chip}>
          <Text style={styles.chipEmoji}>{topic.emoji}</Text>
          <Text style={styles.chipLabel}>{topic.label}</Text>
        </View>
        {saved ? <Text style={styles.savedBadge}>★ saved</Text> : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{fact.title}</Text>
        <Text style={styles.text}>{fact.body}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.source}>Source: {fact.source}</Text>
        <Text style={styles.hint}>Swipe up for next · hold to save</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  savedBadge: {
    color: '#fde68a',
    fontWeight: '600',
    fontSize: 13,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
  },
  text: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 18,
    lineHeight: 26,
  },
  footer: {
    gap: 4,
  },
  source: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
  },
  hint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
});
