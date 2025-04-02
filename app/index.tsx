import { getCategories, getProducts } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";

export default function Index() {

  const {data: products} = useQuery( { // grab the products with useQuery hook
    queryKey: ['products'], //store result in the products key
    queryFn: getProducts, //use the getProducts function from api.ts 
  }) 


  const {data: categories = []} = useQuery( { 
    queryKey: ['categories'], 
    queryFn: getCategories, 
  }) 

  const allCategories = ['all', ...categories]

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Big test!</Text>
    </View>
  );
}
