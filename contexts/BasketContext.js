// BasketContext.js
import React, { createContext, useContext, useState } from 'react';

const BasketContext = createContext();

export const useBasket = () => {
    return useContext(BasketContext);
};

export const BasketProvider = ({ children }) => {
    const [basket, setBasket] = useState([]);

    const handleQuantityChange = (index, quantity) => {
        const updatedBasket = [...basket];
        updatedBasket[index].quantity = quantity;
        setBasket(updatedBasket);
    };

    const handleRemoveItem = (index) => {
        const updatedBasket = basket.filter((_, i) => i !== index);
        setBasket(updatedBasket);
    };

    const value = {
        basket,
        setBasket,
        handleQuantityChange,
        handleRemoveItem
    };

    return (
        <BasketContext.Provider value={value}>
            {children}
        </BasketContext.Provider>
    );
};
