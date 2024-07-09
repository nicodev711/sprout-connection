// pages/search.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
};

const SearchPage = () => {
    const router = useRouter();
    const { query, category, postcode, range } = router.query;

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            let url = `/api/search?query=${query}&category=${category}&postcode=${postcode}&range=${range}`;
            const res = await fetch(url);
            const data = await res.json();
            setResults(data);
            setLoading(false);
        };

        if (query || category || postcode || range) {
            fetchProducts();
        }
    }, [query, category, postcode, range]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
            <Head>
                <title>Sprout Connections - Search</title>
                <meta name="description" content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!" />
                <meta property="og:title" content="Sprout Connections - Fresh Garden Produce from Your Neighbors" />
                <meta property="og:description" content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!" />
                <meta property="og:url" content="https://www.sproutconnections.com" />
            </Head>
            <aside className="w-full bg-gray-100 p-4 rounded-lg shadow-md mb-4 lg:hidden">
                <h2 className="text-xl font-bold mb-4">Search</h2>
                <SearchBar initialQuery={query} initialCategory={category} initialPostcode={postcode} initialRange={range} />
            </aside>
            <div className="w-full lg:w-3/4 p-4">
                <h3 className="text-lg font-bold mb-2 text-center">Search Results</h3>
                {loading ? (
                    <div className="flex justify-center items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <span>Loading...</span>
                    </div>
                ) : (
                    results.length > 0 ? (
                        <div className="flex flex-wrap justify-center">
                            {results.map((result) => (
                                <Link key={result._id} href={`/products/${result._id}`}>
                                    <div className="card card-compact w-64 bg-base-100 shadow-xl m-4">
                                        <figure className="relative h-48 w-full overflow-hidden rounded-lg">
                                            <Image
                                                src={result.imageCDNLink && result.imageCDNLink.trim() !== '' ? result.imageCDNLink : '/product.png'}
                                                alt={result.title}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </figure>
                                        <div className="card-body">
                                            <h2 className="card-title">{result.title}</h2>
                                            {result.distance ? (
                                                <p>{result.distance.toFixed(2)} miles from you</p>
                                            ) : (
                                                <p>Location: {result.postcode} </p>
                                            )}
                                            <p>{truncateText(result.description, 30)}</p>
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
                        <p className="text-center">No results found.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default SearchPage;
