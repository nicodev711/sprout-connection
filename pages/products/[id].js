'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Head from 'next/head';
import keywords from '@/utils/keywords';
import { useCart } from '@/contexts/CartContext';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon
} from 'react-share';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the MapComponent with no SSR
const MapComponent = dynamic(() => import('@/components/dashboard/MapComponent').then(module => module.MapComponentProduct), {
    ssr: false,
});

export default function ProductDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { dispatch } = useCart();

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
        const cartItem = {
            _id: product._id,
            title: product.title,
            description: product.description,
            userId: product.userId,
            quantity: quantity,
            units: product.units,
            price: product.price,
            category: product.category,
            isListed: product.isListed,
            isDelivered: product.isDelivered,
            imageCDNLink: product.imageCDNLink,
            postcode: product.postcode,
            latitude: product.latitude,
            longitude: product.longitude,
            createdAt: product.createdAt,
            modifiedAt: product.modifiedAt,
            unitType: product.unitType // Add this line
        };
        dispatch({ type: 'ADD_ITEM', payload: cartItem });
    };

    const productKeywords = [
        ...keywords.buyers,
        `fresh produce, buy ${product.title}, garden produce, local produce, ${product.title} for sale`
    ].join(', ');

    const shareUrl = `https://www.sproutconnections.com/products/${id}`;

    return (
        <>
            <Head>
                <title>{product.title} - Sprout Connection</title>
                <meta name="description" content={product.description} />
                <meta name="keywords" content={productKeywords} />
                <meta property="og:title" content={product.title} />
                <meta property="og:description" content={product.description} />
                <meta property="og:image" content={product.imageCDNLink} />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:type" content="product" />
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org/",
                      "@type": "Product",
                      "name": "${product.title}",
                      "image": "${product.imageCDNLink}",
                      "description": "${product.description}",
                      "sku": "${product._id}",
                      "offers": {
                        "@type": "Offer",
                        "url": "${shareUrl}",
                        "priceCurrency": "GBP",
                        "price": "${product.price}",
                        "itemCondition": "https://schema.org/NewCondition",
                        "availability": "${product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}",
                        "seller": {
                          "@type": "Organization",
                          "name": "Sprout Connection"
                        }
                      },
                      "areaServed": {
                          "@type": "Place",
                          "address": {
                            "@type": "PostalAddress",
                            "postalCode": "${product.postcode}",
                            "addressLocality": "${product.latitude}, ${product.longitude}"
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
                            src={product.imageCDNLink && product.imageCDNLink.trim() !== '' ? product.imageCDNLink : '/product.png'}
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
                        <div className="h-96 w-full">
                            <MapComponent productLocation={{ lat: product.latitude, lon: product.longitude }} />
                        </div>
                        {product.quantity ? (
                            <p className="text-gray-700 mb-4">Available Quantity: {product.quantity} {product.units}</p>
                        ) : null}
                        <div className="mb-6 mt-6">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                className="input input-bordered w-full"
                                value={quantity}
                                min={product.unitType === 'integer' ? '1' : '0.1'}
                                step={product.unitType === 'integer' ? '1' : '0.1'}
                                max={product.quantity}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (product.unitType === 'integer' && !Number.isInteger(parseFloat(value))) {
                                        alert('This product can only be purchased in whole units.');
                                    } else {
                                        setQuantity(Math.min(Number(value), product.quantity));
                                    }
                                }}
                            />
                        </div>
                        <button
                            className="btn btn-primary w-full py-3 text-lg font-semibold"
                            onClick={handleAddToBasket}
                        >
                            Add to Basket
                        </button>
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Customer Reviews</h2>
                            <p className={"italic text-gray-600"}>We are currently working on this feature</p>
                            {/*<p className="italic text-gray-600">No reviews yet. Be the first to review this product!</p>*/}
                        </div>
                        <div className="mt-8 flex space-x-4">
                            <FacebookShareButton url={shareUrl} quote={product.title} hashtag="#SproutConnection">
                                <FacebookIcon size={40} round/>
                            </FacebookShareButton>
                            <TwitterShareButton url={shareUrl} title={product.title} hashtags={["SproutConnection"]}>
                                <TwitterIcon size={40} round/>
                            </TwitterShareButton>
                            <LinkedinShareButton url={shareUrl} title={product.title} summary={product.description}
                                                 source="Sprout Connection">
                                <LinkedinIcon size={40} round/>
                            </LinkedinShareButton>
                            <WhatsappShareButton url={shareUrl} title={product.title} separator=":: ">
                                <WhatsappIcon size={40} round/>
                            </WhatsappShareButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
