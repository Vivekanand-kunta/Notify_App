import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

import * as Sentry from '@sentry/react-native';

import { Stack } from "expo-router";

Sentry.init({
  dsn: 'https://6a77541a9b8c7336655b902f1a83e269@o4509964924616704.ingest.us.sentry.io/4509964929859584',
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
});

export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <Stack />
    </ClerkProvider>
  )
});