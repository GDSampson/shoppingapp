import { Alert, Button, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import useCartStore from '@/store/cartStore'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/utils/colors';
import CartItem from '@/components/CartItem';
import * as Sentry from '@sentry/react-native';

const Page = () => {
    const { products, total, clearCart } = useCartStore();
    const { bottom } = useSafeAreaInsets();
    const router = useRouter();

    const handleCheckout = () => {
        if (products.length === 0) {
            Alert.alert('Add some products to the cart first')
            return;
        }
        clearCart();
        Alert.alert('Checkout successful!')
        router.dismiss();
    }

    return (
        <View style={styles.container}>
            {products.length === 0 && <Text style={styles.emptyText}>No products in cart!</Text>}
            <FlatList
                data={products}
                contentContainerStyle={{gap: 10}}
                renderItem={({ item }) => <CartItem item={item} />}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={() => (<>
                    {products.length > 0 ? (
                        <Text style={styles.totalText}>Total: ${total}</Text>
                    ) : null}
                </>
                )}
                ListFooterComponent={
                    <Button
                        title='Test Error!'
                        onPress={() => {
                            Sentry.captureException(new Error('First Error'));
                        }}
                    />
                }
            />

            <TouchableOpacity style={[styles.addToCartButton, { paddingBottom: Platform.select({ ios: bottom, android: 15 }) }]} onPress={handleCheckout}>
                <Ionicons name='checkmark' size={20} color={'#fff'} />
                <Text style={styles.addToCartText}>Checkout</Text>
            </TouchableOpacity>

        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    emptyText: {
        textAlign: 'center',
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    },
    addToCartButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
    },
    addToCartText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },

})