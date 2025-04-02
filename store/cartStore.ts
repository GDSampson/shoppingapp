import { Product } from "@/utils/api";
import {create} from 'zustand';

export interface CartState {
    products: Array<Product & {quantity: number}>;
    addProduct: (product: Product) => void;
    reduceProudct: (product: Product) => void;
    clearCart: () => void;
    total: number;
    count: number;
}

const INITIAL_STATE = {
    products: [],
    total: 0,
    count: 0,
}

const useCartStore = create<CartState>((set, get) => ({
    ...INITIAL_STATE,
    addProduct: (product) => {},
    reduceProudct: (product) => {},
    clearCart: () => {},
}))

export default useCartStore;