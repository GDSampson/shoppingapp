import CartButton from "@/components/CartButton";
import { useMMKVDevTools } from "@dev-plugins/react-native-mmkv";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { storage } from "@/store/mmkv";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://03c3e963206190b6e4115dcb8af20d09@o4509089405927424.ingest.us.sentry.io/4509089416675328',

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