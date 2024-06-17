// components/Product.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import Head from 'next/head';
import keywords from '@/utils/keywords';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { state, dispatch } = useCart();

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
        const cartItem = { ...product, quantity };
        dispatch({ type: 'ADD_ITEM', payload: cartItem });
        //alert(`Added ${quantity} ${product.units} of ${product.title} to the basket!`);
    };

    // Generate a list of keywords for this specific product page
    const productKeywords = [
        ...keywords.buyers,
        `fresh produce, buy ${product.title}, garden produce, local produce, ${product.title} for sale`
    ].join(', ');

    return (
        <>
            <Head>
                <title>{product.title} - Sprout Connection</title>
                <meta name="description" content={product.description} />
                <meta name="keywords" content={productKeywords} />
                <meta property="og:title" content={product.title} />
                <meta property="og:description" content={product.description} />
                <meta property="og:image" content={product.imageCDNLink} />
                <meta property="og:url" content={`https://www.sproutconnections.com/products/${id}`} />
                <meta property="og:type" content="product" />
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org/",
                      "@type": "Product",
                      "name": "${product.title}",
                      "image": "${product.imageCDNLink}",
                      "description": "${product.description}",
                      "sku": "${product.id}",
                      "offers": {
                        "@type": "Offer",
                        "url": "https://www.sproutconnections.com/products/${id}",
                        "priceCurrency": "GBP",
                        "price": "${product.price}",
                        "itemCondition": "https://schema.org/NewCondition",
                        "availability": "${product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}",
                        "seller": {
                          "@type": "Organization",
                          "name": "Sprout Connection"
                        }
                      }
                    }
                    `}
                </script>
            </Head>
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
                                min="0.1"
                                step="0.1"
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
        </>
    );
}
