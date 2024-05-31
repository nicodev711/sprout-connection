import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from "next/link";
import Image from "next/image";

export default function Search() {
    const router = useRouter();
    const { query, category } = router.query;
    const [results, setResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState('');

    const handleSearch = () => {
        router.push(`/search?query=${searchQuery}&category=${categories}`);
    };

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
        <div className="container mx-auto p-4 flex flex-col lg:flex-row">
            <aside className="w-full lg:w-1/4 bg-gray-100 p-4 rounded-lg shadow-md mb-4 lg:hidden">
                <h2 className="text-xl font-bold mb-4">Search</h2>
                <div className="flex flex-col space-y-2">
                    <input
                        className="input input-bordered"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        className="select select-bordered"
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                    >
                        <option value="" disabled>Filter by Category</option>
                        <option>Vegetables</option>
                        <option>Fruits</option>
                        <option>Honey</option>
                        <option>Plants</option>
                        <option>Seeds</option>
                    </select>
                    <button className="btn btn-primary mt-2" onClick={handleSearch}>Search</button>
                </div>
            </aside>
            <main className="w-full lg:w-3/4">
                <h1 className="text-2xl font-bold mb-4">Search Results</h1>
                {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((result) => (
                            <Link key={result._id} href={`/products/${result._id}`}>
                                <div key={result.id} className="card card-compact w-full bg-base-100 shadow-xl">
                                    <figure>
                                        <Image src={result.imageCDNLink} alt={result.title} width="500" height="500" className="w-full h-auto"/>
                                    </figure>
                                    <div className="card-body">
                                        <h2 className="card-title">{result.title}</h2>
                                        <p>{result.description}</p>
                                        <p className="text-lg font-semibold">£{result.price}</p>
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
            </main>
        </div>
    );
}
