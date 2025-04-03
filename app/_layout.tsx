import CartButton from "@/components/CartButton";
import { useMMKVDevTools } from "@dev-plugins/react-native-mmkv";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack, useNavigationContainerRef, useRouter } from "expo-router";
import { storage } from "@/store/mmkv";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Sentry from '@sentry/react-native';
import { useEffect } from "react";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true, // only in native builds and not in expo go
})

Sentry.init({
  dsn: 'https://03c3e963206190b6e4115dcb8af20d09@o4509089405927424.ingest.us.sentry.io/4509089416675328',
  attachScreenshot: true,
  debug: false,
  tracesSampleRate: 1.0, // adjust to lower in productuion
  _experiments: {
    profileSampleRate: 1.0, // same as the other sample rate
  },
  integrations:[
    Sentry.mobileReplayIntegration({
      // these would be set to true to mask any user information
      maskAllImages: false,
      maskAllText: false,
      maskAllVectors: false,
    }),
    Sentry.spotlightIntegration(),
    navigationIntegration,
  ]

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute stale time (queries would be cached for this long)
    },
  },
});

export default Sentry.wrap(function RootLayout() {
  useReactQueryDevTools(queryClient);
  useMMKVDevTools({
    storage
  });

  const router = useRouter();

  const ref = useNavigationContainerRef();
  useEffect(() => {
    navigationIntegration.registerNavigationContainer(ref);
  }, [ref])

  return (
    <QueryClientProvider client={queryClient}>
      {/* ReanimatedSwipeable requires being used within a GestureHandlerRootView */}
      <GestureHandlerRootView> 
        <Stack>
          <Stack.Screen name="index"
            options={{
              title: 'Only Dans',
              headerShadowVisible: false,
              headerTitleAlign: 'center',
              headerRight: () => <CartButton />
            }}
          />
          <Stack.Screen name="product/[id]" options={{
            title: '',
            headerBackTitle: 'Product', //ios only
          }} />

          <Stack.Screen name="cart" options={{
            title: 'Cart',
            presentation: 'modal',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.dismiss()}>
                <Ionicons name="close" size={24} color={'black'} />
              </TouchableOpacity>
            )
          }} />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
});