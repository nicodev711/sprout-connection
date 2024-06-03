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
    const [category, setCategory] = useState('Vegetables');
    const [isListed, setIsListed] = useState(true);
    const [isDelivered, setIsDelivered] = useState(false);
    const [image, setImage] = useState(null);
    const [imageCDNLink, setImageCDNLink] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageUpload = async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            setLoading(true);
            const response = await fetch('/api/products/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: reader.result }),
            });

            if (response.ok) {
                const data = await response.json();
                setImageCDNLink(data.url);
            } else {
                alert('Failed to upload image.');
            }
            setLoading(false);
        };
    };

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
                    setCategory(product.category);
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

    useEffect(() => {
        const getToken = async () => {
            const response = await fetch('/api/auth/token');
            const data = await response.json();
            setToken(data.token);
        };

        getToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate a delay for CDN creation
        setTimeout(async () => {
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT', // Changed to 'PUT' for updating the product
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, quantity, units, price, category, imageCDNLink, isListed, isDelivered }),
            });

            if (response.ok) {
                alert('Product updated successfully!');
                router.push('/products/manage');
            } else {
                const errorData = await response.json();
                alert(`Failed to update product: ${errorData.error || 'Unknown error'}`);
            }
            setLoading(false);
        }, 2000);
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
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
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
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="category">
                        Category
                    </label>
                    <select
                        id="category"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Honey">Honey</option>
                        <option value="Plants">Plants</option>
                        <option value="Seeds">Seeds</option>
                    </select>
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
                    <label className="block text-gray-700 mb-2" htmlFor="image">Image</label>
                    <input
                        id="image"
                        type="file"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                    />
                </div>
                <div className="mb-4" hidden>
                    <label className="block text-gray-700 mb-2" htmlFor="imageCDNLink">Image CDN Link
                        (Optional)</label>
                    <input
                        id="imageCDNLink"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Image CDN Link"
                        value={imageCDNLink}
                        onChange={(e) => setImageCDNLink(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-accent mt-2">
                    {loading ? <span className="loading loading-spinner loading-md"></span> : 'Save Changes'}
                </button>
            </form>
        </section>
    );
}
