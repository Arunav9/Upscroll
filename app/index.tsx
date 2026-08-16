import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { isOnboarded } from '../src/services/prefs';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboardedState] = useState(false);

  useEffect(() => {
    isOnboarded().then((value) => {
      setOnboardedState(value);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: '#0f172a' }} />;
  }

  return <Redirect href={onboarded ? '/feed' : '/onboarding'} />;
}
