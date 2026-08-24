import { router } from 'expo-router';
import AppSplash from '../src/components/AppSplash';

export default function Index() {
  return <AppSplash onLaunch={() => router.replace('/onboarding')} />;
}
