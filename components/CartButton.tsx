import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useCartStore from '@/store/cartStore'

const CartButton = () => {
    const { count } = useCartStore(); // getting the count from our cart state

    return (
        <View>
            <Text>{count}</Text>
        </View>
    )
}

export default CartButton

const styles = StyleSheet.create({})