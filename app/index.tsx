import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts, Product } from "@/utils/api";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {

  const {data: products, isLoading, refetch, isRefetching} = useQuery( { // grab the products with useQuery hook
    queryKey: ['products'], //store result in the products key
    queryFn: getProducts, //use the getProducts function from api.ts 
  }) 


  const {data: categories = []} = useQuery( { 
    queryKey: ['categories'], 
    queryFn: getCategories, 
  }) 

  const allCategories = ['all', ...categories]

  const renderProduct = useCallback(({item}: {item: Product}) => {
    return <ProductCard product={item} /> // the product prop in the component will store the item 
  }, []);

  return (
    <View style={styles.container}>
      <FlashList 
        data={products}
        renderItem={renderProduct}
        estimatedItemSize={200}
        numColumns={2}
        contentContainerStyle={ { padding: 8}}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})