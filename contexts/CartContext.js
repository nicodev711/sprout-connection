// context/CartContext.js
import { createContext, useReducer, useContext, useEffect } from 'react';

const CartContext = createContext();

// context/CartContext.js
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            const updatedStateAdd = { ...state, items: [...state.items, action.payload] };
            localStorage.setItem('cart', JSON.stringify(updatedStateAdd));
            return updatedStateAdd;
        case 'REMOVE_ITEM':
            const updatedStateRemove = { ...state, items: state.items.filter(item => item._id !== action.payload) };
            localStorage.setItem('cart', JSON.stringify(updatedStateRemove));
            return updatedStateRemove;
        case 'CLEAR_CART':
            localStorage.setItem('cart', JSON.stringify({ items: [] }));
            return { ...state, items: [] };
        case 'UPDATE_ITEM_QUANTITY':
            const { productId, quantity } = action.payload;
            const updatedItems = state.items.map(item =>
                item._id === productId ? { ...item, quantity } : item
            );
            const updatedStateQuantity = { ...state, items: updatedItems };
            localStorage.setItem('cart', JSON.stringify(updatedStateQuantity));
            return updatedStateQuantity;
        case 'INITIALIZE_CART':
            return action.payload;
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
