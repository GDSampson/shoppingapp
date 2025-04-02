import CartButton from "@/components/CartButton";
import { useMMKVDevTools } from "@dev-plugins/react-native-mmkv";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { storage } from "@/store/mmkv";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute stale time (queries would be cached for this long)
    },
  },
});

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  useMMKVDevTools({
    storage
  });

  return (
    <QueryClientProvider client={queryClient}>
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
        }}/>
        
        <Stack.Screen name="cart" options={{
          title: 'Cart',
          presentation: 'modal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Ionicons name="close" size={24} color={'black'}/>
            </TouchableOpacity>
          ) 
        }}/>
      </Stack>
    </QueryClientProvider>
  );
}
