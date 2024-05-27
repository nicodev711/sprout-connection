import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products/user');
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleEdit = (productId) => {
        router.push(`/products/edit/${productId}`);
    };

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`/api/products/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <section className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold">Manage Products</h2>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(product => (
                        <div key={product._id} className="p-4 bg-gray-50 rounded-lg shadow">
                            <h3 className="text-lg font-semibold">{product.title}</h3>
                            <p>{product.description}</p>
                            <p>Quantity: {product.quantity} {product.units}</p>
                            <p>Price: ${product.price}</p>
                            <div className="flex gap-2 mt-2">
                                <button className="btn btn-accent" onClick={() => handleEdit(product._id)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products found.</p>
            )}
        </section>
    );
}