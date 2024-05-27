import { useState } from 'react';

export default function CreateProduct({ token }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [units, setUnits] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Vegetables');
    const [image, setImage] = useState(null);
    const [imageCDNLink, setImageCDNLink] = useState('');

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

        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description, quantity, units, price, category, imageCDNLink }),
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
        } else {
            const errorData = await response.json();
            alert(`Failed to create product: ${errorData.error || 'Unknown error'}`);
        }
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
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="units">Units</label>
                        <input
                            id="units"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Units"
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
                        <label className="block text-gray-700 mb-2" htmlFor="image">Image</label>
                        <input
                            id="image"
                            type="file"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                        />
                    </div>
                    <div className="mb-4" hidden>
                        <label className="block text-gray-700 mb-2" htmlFor="imageCDNLink">Image CDN Link (Optional)</label>
                        <input
                            id="imageCDNLink"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Image CDN Link"
                            value={imageCDNLink}
                            onChange={(e) => setImageCDNLink(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300">
                        Create Product
                    </button>
                </form>
            </div>
        </div>
    );
}