// CartContext.js
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { signToken, verifyToken } from '@/lib/jwt';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            const updatedCart = [...state.items, action.payload];
            signAndStoreCart(updatedCart);
            return { items: updatedCart };
        case 'REMOVE_ITEM':
            const filteredCart = state.items.filter(item => item._id !== action.payload);
            signAndStoreCart(filteredCart);
            return { items: filteredCart };
        case 'UPDATE_ITEM_QUANTITY':
            const updatedItems = state.items.map(item =>
                item._id === action.payload.productId
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
            signAndStoreCart(updatedItems);
            return { items: updatedItems };
        case 'INITIALIZE_CART':
            return { items: action.payload };
        default:
            return state;
    }
};

const signAndStoreCart = async (cart) => {
    const token = await signToken({ items: cart });
    localStorage.setItem('cart', token);
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    useEffect(() => {
        const initializeCart = async () => {
            const token = localStorage.getItem('cart');
            if (token) {
                try {
                    const decodedCart = await verifyToken(token);
                    if (decodedCart) {
                        dispatch({ type: 'INITIALIZE_CART', payload: decodedCart.items });
                    }
                } catch (error) {
                    console.error('Invalid or expired cart token', error);
                }
            }
        };

        initializeCart();
    }, []);

    const addItemToCart = (item) => {
        const updatedCart = [...state.items, item];
        signAndStoreCart(updatedCart);
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeItemFromCart = (productId) => {
        const updatedCart = state.items.filter(item => item._id !== productId);
        signAndStoreCart(updatedCart);
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
    };

    const updateItemQuantity = (productId, quantity, unitType) => {
        if (unitType === 'integer' && !Number.isInteger(parseFloat(quantity))) {
            alert('This product can only be purchased in whole units.');
            return;
        }
        const updatedItems = state.items.map(item =>
            item._id === productId ? { ...item, quantity } : item
        );
        signAndStoreCart(updatedItems);
        dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { productId, quantity } });
    };

    return (
        <CartContext.Provider value={{ state, dispatch, addItemToCart, removeItemFromCart, updateItemQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
