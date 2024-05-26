import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function EditProduct() {
    const router = useRouter();
    const { id } = router.query;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [units, setUnits] = useState('');
    const [price, setPrice] = useState(0);
    const [isListed, setIsListed] = useState(true);
    const [isDelivered, setIsDelivered] = useState(false);
    const [imageCDNLink, setImageCDNLink] = useState('');

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get(`/api/products/${id}`);
                    const product = response.data;
                    setTitle(product.title);
                    setDescription(product.description);
                    setQuantity(product.quantity);
                    setUnits(product.units);
                    setPrice(product.price);
                    setIsListed(product.isListed);
                    setIsDelivered(product.isDelivered);
                    setImageCDNLink(product.imageCDNLink);
                } catch (error) {
                    console.error('Failed to fetch product:', error);
                }
            };

            fetchProduct();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`/api/products/${id}`, {
                title,
                description,
                quantity,
                units,
                price,
                isListed,
                isDelivered,
                imageCDNLink,
            });
            router.push('/products/manage');
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    return (
        <section className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold">Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="title">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        className="input input-bordered w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        className="textarea textarea-bordered w-full"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="quantity">
                        Quantity
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        className="input input-bordered w-full"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="units">
                        Units
                    </label>
                    <input
                        type="text"
                        id="units"
                        className="input input-bordered w-full"
                        value={units}
                        onChange={(e) => setUnits(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="price">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        className="input input-bordered w-full"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="isListed"
                        className="checkbox"
                        checked={isListed}
                        onChange={(e) => setIsListed(e.target.checked)}
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700" htmlFor="isListed">
                        Is Listed
                    </label>
                </div>
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="isDelivered"
                        className="checkbox"
                        checked={isDelivered}
                        onChange={(e) => setIsDelivered(e.target.checked)}
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700" htmlFor="isDelivered">
                        Is Delivered
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="imageCDNLink">
                        Image CDN Link
                    </label>
                    <input
                        type="text"
                        id="imageCDNLink"
                        className="input input-bordered w-full"
                        value={imageCDNLink}
                        onChange={(e) => setImageCDNLink(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-accent mt-2">
                    Save Changes
                </button>
            </form>
        </section>
    );
}
