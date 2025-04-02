import { Product } from "@/utils/api";
import { create } from 'zustand';
import { zustandStorage } from "./mmkv";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartState {
    products: Array<Product & { quantity: number }>;
    addProduct: (product: Product) => void;
    reduceProduct: (product: Product) => void;
    clearCart: () => void;
    total: number;
    count: number;
}

const INITIAL_STATE = {
    products: [],
    total: 0,
    count: 0,
}

const useCartStore = create<CartState>()(
    // wrap the set in persist
    persist(
        (set) => ({
            ...INITIAL_STATE,
            addProduct: (product) => {
                set((state) => {
                    //check if the product is present
                    const hasProduct = state.products.find((p) => p.id === product.id);
                    // calc the new total
                    const newTotal = +state.total.toFixed(2) + +product.price.toFixed(2);
                    // calc the count
                    const newCount = state.count + 1;

                    if (hasProduct) {
                        return {
                            // if product already exists, increase quantity of that product by 1
                            products: state.products.map((p) =>
                                p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
                            ),
                            total: newTotal,
                            count: newCount,
                        }

                    } else {
                        return {
                            //otherwise add a product with quantity of 1
                            products: [...state.products, { ...product, quantity: 1 }],
                            total: newTotal,
                            count: newCount,
                        }
                    }
                })
            },
            reduceProduct: (product) => {
                set((state) => {
                    const newTotal = +state.total.toFixed(2) - +product.price.toFixed(2);
                    const newCount = state.count - 1;

                    return {
                        //return the new state of the products
                        products: state.products
                            // if product matches the produc id subtract 1 from the quantity
                            .map((p) => {
                                if (p.id === product.id) {
                                    return { ...p, quantity: p.quantity - 1 };
                                }
                                return p;
                            })
                            .filter((p) => p.quantity > 0),

                        total: newTotal,
                        count: newCount,
                    }
                })
            },
            clearCart: () => {
                //reset the cart to the initial values
                set(INITIAL_STATE);
            },
        }),
        // second persist argument specifies where to store the state and then storing as JSON in mmkv
        {
            name: 'cart',
            storage: createJSONStorage(() => zustandStorage ),
        }
    )
);

export default useCartStore;