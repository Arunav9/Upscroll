import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { StyleSheet, Text } from 'react-native';

const NEON_AURORA = ['#22d3ee', '#3b82f6', '#d946ef', '#f472b6'] as const;

export default function Wordmark() {
  return (
    <MaskedView maskElement={<Text style={styles.text}>Upscroll</Text>}>
      <LinearGradient
        colors={NEON_AURORA}
        locations={[0, 0.32, 0.58, 0.85]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.text, styles.hidden]}>Upscroll</Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  hidden: {
    opacity: 0,
  },
});
