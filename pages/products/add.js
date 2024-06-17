import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateProduct({ token }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [units, setUnits] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Vegetables');
    const [image, setImage] = useState(null);
    const [imageCDNLink, setImageCDNLink] = useState('');
    const [unitType, setUnitType] = useState('integer');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleImageUpload = async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
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
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(async () => {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, quantity, units, price, category, imageCDNLink, unitType }),
            });

            if (response.ok) {
                setTitle('');
                setDescription('');
                setQuantity('');
                setUnits('');
                setPrice('');
                setImage(null);
                setImageCDNLink('');
                alert('Product created successfully!');
                router.push('/dashboard');
            } else {
                const errorData = await response.json();
                alert(`Failed to create product: ${errorData.error || 'Unknown error'}`);
            }

            setLoading(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Create New Product</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="quantity">Quantity</label>
                        <input
                            id="quantity"
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="units">Units</label>
                        <input
                            id="units"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Units (e.g., kg, pieces, packs)"
                            value={units}
                            onChange={(e) => setUnits(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="price">Price</label>
                        <input
                            id="price"
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="category">Category</label>
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
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="image">Image</label>
                        <input
                            id="image"
                            type="file"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Can this product be sold in fractional quantities?</label>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="integer"
                                name="unitType"
                                value="integer"
                                checked={unitType === 'integer'}
                                onChange={(e) => setUnitType(e.target.value)}
                                className="mr-2"
                            />
                            <label htmlFor="integer" className="mr-4">No, only whole units</label>
                            <input
                                type="radio"
                                id="decimal"
                                name="unitType"
                                value="decimal"
                                checked={unitType === 'decimal'}
                                onChange={(e) => setUnitType(e.target.value)}
                                className="mr-2"
                            />
                            <label htmlFor="decimal">Yes, fractional units are allowed</label>
                        </div>
                        <p className="text-gray-500 text-sm mt-2">Select "No" if your product can only be sold in whole units (e.g., pieces, packs). Select "Yes" if your product can be sold in fractional quantities (e.g., weight, volume).</p>
                    </div>
                    <button type="submit"
                            className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300">
                        {loading ? <span className="loading loading-spinner loading-md"></span> : 'Create Product'}
                    </button>
                </form>
            </div>
        </div>
    );
}
