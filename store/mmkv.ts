import { MMKV } from "react-native-mmkv";
import {StateStorage} from 'zustand/middleware';

// create a new instance of MMKV storage
export const storage = new MMKV({
    id: 'mmkv-store',
})

//connect zustand with mmkv
export const zustandStorage: StateStorage = {
    //get a value from storage - runs on app load to restore state
    getItem: (name: string) => {
        return storage.getString(name) || null;
    },
    // save value to storage - runs whenever the state changes
    setItem: (name: string, value: string) => {
        storage.set(name, value);
    },
    // deletes a value from storage - runs when data is cleared
    removeItem: (name: string) => {
        storage.delete(name);
    },
};