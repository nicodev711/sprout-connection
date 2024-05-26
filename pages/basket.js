import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Basket = () => {
    const [basket, setBasket] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
        setBasket(storedBasket);
    }, []);

    const handleQuantityChange = (index, quantity) => {
        const updatedBasket = [...basket];
        updatedBasket[index].quantity = quantity;
        setBasket(updatedBasket);
        localStorage.setItem('basket', JSON.stringify(updatedBasket));
    };

    const handleRemoveItem = (index) => {
        const updatedBasket = basket.filter((_, i) => i !== index);
        setBasket(updatedBasket);
        localStorage.setItem('basket', JSON.stringify(updatedBasket));
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Your Basket</h1>
            {basket.length === 0 ? (
                <p>Your basket is empty.</p>
            ) : (
                <div>
                    {basket.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-white shadow-lg rounded-lg mb-4">
                            <div className="flex items-center">
                                <img src={item.imageCDNLink} alt={item.title} className="w-16 h-16 rounded-lg mr-4" />
                                <div>
                                    <h2 className="text-xl font-semibold">{item.title}</h2>
                                    <p>${item.price} per {item.units}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    min="1"
                                    className="input input-bordered w-16 mr-4"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                />
                                <button className="btn btn-error" onClick={() => handleRemoveItem(index)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-primary w-full mt-4" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Basket;
