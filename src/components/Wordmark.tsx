import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../constants/theme';

export default function Wordmark() {
  return (
    <MaskedView maskElement={<Text style={styles.text}>Upscroll</Text>}>
      <LinearGradient
        colors={colors.auroraGradient}
        locations={[0, 0.3333, 0.6667, 1]}
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
