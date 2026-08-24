import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../constants/theme';

export default function Wordmark({ fontSize = 32 }: { fontSize?: number }) {
  const textStyle = [
    styles.text,
    { fontSize, letterSpacing: fontSize * -0.02 },
  ];

  return (
    <MaskedView maskElement={<Text style={textStyle}>Skrollit</Text>}>
      <LinearGradient
        colors={colors.auroraGradient}
        locations={[0, 0.3333, 0.6667, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[textStyle, styles.hidden]}>Skrollit</Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '900',
  },
  hidden: {
    opacity: 0,
  },
});
