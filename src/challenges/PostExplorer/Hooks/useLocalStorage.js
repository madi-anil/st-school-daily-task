import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState (() => {
        try {
            const saved = Window.LocalStorage.getItem(key);
            return saved !== null ? JSON.parse(saved) : initialValue;
        } catch {
            return initialValue;
        }
    });


useEffect(() => {
    try{
        Window.LocalStorage.setItem(key, JSON.stringify(value));
    } catch {

    }
}, [key,value]);
  
return [value, setValue];
}