import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [basket, setBasket] = useState([]);
    const router = useRouter();

    const addToBasket = async (product, quantity) => {
        // Fetch product details to ensure full population
        try {
            const response = await axios.get(`/api/products/${product._id}`);
            const fullProduct = response.data;

            setBasket((prevBasket) => {
                const existingItemIndex = prevBasket.findIndex(item => item.productId === product._id);
                if (existingItemIndex >= 0) {
                    const newBasket = [...prevBasket];
                    newBasket[existingItemIndex].quantity += quantity;
                    return newBasket;
                } else {
                    return [...prevBasket, { productId: product._id, title: fullProduct.title, price: fullProduct.price, quantity }];
                }
            });
        } catch (error) {
            console.error('Failed to fetch product details:', error);
        }
    };

    const updateItemQuantity = (productId, quantity) => {
        setBasket((prevBasket) =>
            prevBasket.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    };

    const removeItemFromBasket = (productId) => {
        setBasket((prevBasket) =>
            prevBasket.filter(item => item.productId !== productId)
        );
    };

    const clearBasket = () => {
        setBasket([]);
    };

    const saveBasket = useCallback(async (updatedBasket) => {
        if (user) {
            try {
                const response = await fetch('/api/basket', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ basket: updatedBasket }),
                });
                if (!response.ok) {
                    throw new Error('Failed to save basket');
                }
            } catch (error) {
                console.error('Failed to save basket:', error);
            }
        }
    }, [user]);

    const loadBasket = useCallback(async () => {
        if (user) {
            try {
                const response = await fetch('/api/basket', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setBasket(data.items || []);
                } else {
                    throw new Error('Failed to load basket');
                }
            } catch (error) {
                console.error('Failed to load basket:', error);
            }
        }
    }, [user]);

    const fetchUser = useCallback(async () => {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            setUser(data.user);
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (user) {
            loadBasket();
        }
    }, [user, loadBasket]);

    useEffect(() => {
        if (basket && basket.length > 0) {
            saveBasket(basket);
        }
    }, [basket, saveBasket]);

    const logout = async () => {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            setUser(null);
            setBasket([]);
            await router.push('/');
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout, fetchUser, basket, addToBasket, updateItemQuantity, removeItemFromBasket, clearBasket }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
