import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef } from 'react'
import { Product } from '@/utils/api'
import { Image } from 'expo-image'
import useCartStore from '@/store/cartStore'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/utils/colors'
import ReanimatedSwipable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    Easing,
    withTiming,
} from 'react-native-reanimated'

interface CartItemProps {
    item: Product & { quantity: number }
}

const LeftActions = (
    progress: SharedValue<number>, // track animation progress
    dragX: SharedValue<number>,  // track x axis drag distance
    onShouldDelete: () => void,
) => {
    //make animation style that moves the icon based on drag
    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: dragX.value - 100 }],
        };
    })

    return (
        <Reanimated.View style={styleAnimation}>
            <TouchableOpacity style={styles.leftAction} onPress={onShouldDelete}>
                <Ionicons name='trash' size={24} color='#fff' />
            </TouchableOpacity>
        </Reanimated.View>
    )
}

const CartItem = ({ item }: CartItemProps) => {
    const { addProduct, reduceProduct } = useCartStore();
    const reanimatedRef = useRef<SwipeableMethods>(null);
    const opacityAnimation = useSharedValue(1);
    const scaleAnimation = useSharedValue(1);
    const heightAnimation = useSharedValue(80);

    const handleQuantityChanged = (type: 'increment' | 'decrement') => {
        if (type === 'increment') {
            addProduct(item);
        } else {
            reduceProduct(item);
        }
        //create a pop animation
        scaleAnimation.value = withSequence(
            //expand to 1,2x original size
            withSpring(1.2, { damping: 2, stiffness: 80 }),
            // return to original size
            withSpring(1, { damping: 2, stiffness: 80 })
        );
    };

    const onShouldDelete = async () => {
        //animation the opacity and height to 0 over 300 milliseconds 
        opacityAnimation.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) })
        heightAnimation.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) })

        // wait that amount of time before doing anything
        await new Promise((resolve) => setTimeout(resolve, 300));

        reanimatedRef.current?.close();
        for (let i = 0; i < item.quantity; i++) {
            reduceProduct(item);
        }

    };

    const quantityAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scaleAnimation.value }]
        }
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacityAnimation.value,
            height: heightAnimation.value,
        }
    });

    return (
        <Reanimated.View style={animatedStyle}>


            <ReanimatedSwipable ref={reanimatedRef}
                renderLeftActions={(progress, dragX) => LeftActions(progress, dragX, onShouldDelete)}
                leftThreshold={50}
                friction={2}
                containerStyle={styles.swipeable}
            >
                <View style={styles.cartItemContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.itemContainer}>
                        <Text style={styles.cartItemName}>{item.title}</Text>
                        <Text>Price: ${item.price}</Text>
                    </View>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChanged('decrement')}>
                            <Ionicons name='remove' size={24} color={'black'} />
                        </TouchableOpacity>

                        <Reanimated.Text style={[styles.cartItemQuantity, quantityAnimatedStyle]}>{item.quantity}</Reanimated.Text>

                        <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChanged('increment')}>
                            <Ionicons name='add' size={24} color={'black'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ReanimatedSwipable>
        </Reanimated.View>
    )
}

export default CartItem

const styles = StyleSheet.create({
    cartItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        backgroundColor: '#fff',
        height: 80,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    cartItemName: {
        fontSize: 16,
        fontWeight: '600',
    },
    itemContainer: {
        flex: 1,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    quantityButton: {
        padding: 10,
    },
    cartItemQuantity: {
        fontWeight: 'bold',
        backgroundColor: COLORS.primary,
        fontSize: 16,
        padding: 5,
        width: 30,
        color: 'white',
        textAlign: 'center',
        borderRadius: 8,
    },
    swipeable: {
        height: 80,
    },
    leftAction: {
        backgroundColor: 'red',
        width: 100,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})