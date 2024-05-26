import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from "next/link";

export default function Search() {
    const router = useRouter();
    const { query, category } = router.query;
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query || category) {
            const fetchResults = async () => {
                try {
                    const response = await axios.get(`/api/search`, {
                        params: { query, category }
                    });
                    setResults(response.data);
                } catch (error) {
                    console.error('Failed to fetch search results:', error);
                }
            };

            fetchResults();
        }
    }, [query, category]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Search Results</h1>
            {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((result) => (
                        <Link key={result._id} href={`/products/${result._id}`}>
                            <div key={result.id} className="card card-compact w-96 bg-base-100 shadow-xl">
                                <figure><img src={result.imageCDNLink} alt={result.title}/></figure>
                                <div className="card-body">
                                    <h2 className="card-title">{result.title}</h2>
                                    <p>{result.description}</p>
                                    <p className="text-lg font-semibold">${result.price}</p>
                                    <div className="card-actions justify-end">
                                        <button className="btn btn-primary">Buy Now</button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
}
