import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';

export default function ProductDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addToBasket } = useUser();

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get(`/api/products/${id}`);
                    setProduct(response.data);
                } catch (error) {
                    console.error('Failed to fetch product details:', error);
                }
            };

            fetchProduct();
        }
    }, [id]);

    if (!product) return <p>Loading...</p>;

    const handleAddToBasket = () => {
        addToBasket(product, quantity);
        //alert(`Added ${quantity} ${product.units} of ${product.title} to the basket!`);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col lg:flex-row lg:space-x-8">
                <div className="lg:w-1/2">
                    <Image
                        src={product.imageCDNLink}
                        alt={product.title}
                        width={500}
                        height={500}
                        className="rounded-lg shadow-lg"
                        objectFit="cover"
                    />
                </div>
                <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold mb-6">{product.title}</h1>
                    <p className="text-2xl font-semibold text-green-600 mb-4">£{product.price} per {product.units}</p>
                    <p className="text-gray-700 mb-6 break-words">{product.description}</p>
                    {product.quantity ? (
                        <p className="text-gray-700 mb-4">Available Quantity: {product.quantity} {product.units}</p>
                    ) : (
                        <p className="text-gray-700 mb-4">No Quantity Available</p>
                    )}
                    <div className="mb-6">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            className="input input-bordered w-full"
                            value={quantity}
                            min="1"
                            max={product.quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>
                    <button
                        className="btn btn-primary w-full py-3 text-lg font-semibold"
                        onClick={handleAddToBasket}
                    >
                        Add to Basket
                    </button>
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
                        <p className="italic text-gray-600">No reviews yet. Be the first to review this product!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
