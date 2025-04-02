import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts, Product } from "@/utils/api";
import { COLORS } from "@/utils/colors";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import {useHeaderHeight} from '@react-navigation/elements';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const headerHeight = useHeaderHeight();

  const { data: products, isLoading, refetch, isRefetching } = useQuery({ // grab the products with useQuery hook
    queryKey: ['products'], //store result in the products key
    queryFn: getProducts, //use the getProducts function from api.ts 
  })


  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const allCategories = ['all', ...categories]

  const filteredProducts = useMemo(() => {
    return products?.filter((product) => {
      if (selectedCategory !== 'all') {
        return product.category === selectedCategory;
      }
      return product.title.toLowerCase().includes(searchQuery.toLowerCase());
    })
  }, [products, searchQuery, selectedCategory]);

  const renderProduct = useCallback(({ item }: { item: Product }) => {
    return <ProductCard product={item} /> // the product prop in the component will store the item 
  }, []);

  return (
    <View style={[styles.container, {marginTop: Platform.select({ios: headerHeight, android: 0})} ]}>
      <Stack.Screen
        options={{headerSearchBarOptions: {onChangeText: 
          (e) => setSearchQuery(e.nativeEvent.text)}}}
      />
      <View style={styles.categoryContainer}>
        <ScrollView style={styles.categoryScrollView} horizontal showsHorizontalScrollIndicator={false}>
          {allCategories.map((category) => (
            <Pressable
              key={category}
              style={[styles.categoryButton, 
              selectedCategory === category && styles.selectedCategory,]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryButtonText,
                selectedCategory === category && styles.selectedCategoryText
               ]}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <FlashList
        data={filteredProducts}
        renderItem={renderProduct}
        estimatedItemSize={200}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
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
  categoryContainer: {
    height: 60,
    zIndex:1,
    boxShadow: '0 0 10px rgba(0, 0, 0, .3)',
  },
  categoryScrollView:{
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',


  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategory: {
    backgroundColor: COLORS.primary,
  },
  selectedCategoryText: {
    color:'#fff',
  }
})