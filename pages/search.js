// pages/search.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchBar from '@/components/SearchBar';
import Link from "next/link";
import Image from "next/image"

const SearchPage = () => {
    const router = useRouter();
    const { query, category, postcode, range } = router.query;

    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch(`/api/search?query=${query}&category=${category}&postcode=${postcode}&range=${range}`);
            const data = await res.json();
            setResults(data);
        };

        if (query || category || postcode || range) {
            fetchProducts();
        }
    }, [query, category, postcode, range]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
            <aside className="w-full bg-gray-100 p-4 rounded-lg shadow-md mb-4 lg:hidden">
                <h2 className="text-xl font-bold mb-4">Search</h2>
                <SearchBar initialQuery={query} initialCategory={category} initialPostcode={postcode} initialRange={range} />
            </aside>
            <div className="w-full lg:w-3/4 p-4 ">
                <h3 className="text-lg font-bold mb-2 text-center">Search Results</h3>
                {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((result) => (
                            <Link key={result._id} href={`/products/${result._id}`}>
                                <div key={result.id} className="card card-compact w-96 bg-base-100 shadow-xl">
                                    <figure><Image src={result.imageCDNLink} alt={result.title} width="500" height="500"/></figure>
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
            </div>
        </div>
    );
};

export default SearchPage;
