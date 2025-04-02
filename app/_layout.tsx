import CartButton from "@/components/CartButton";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute stale time (queries would be cached for this long)
    },
  },
});

export default function RootLayout() {
  useReactQueryDevTools(queryClient);

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
      </Stack>
    </QueryClientProvider>
  );
}
