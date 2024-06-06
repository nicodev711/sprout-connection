import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';

const SearchBar = ({ initialQuery = '', initialCategory = '', initialRange = 5 }) => {
    const router = useRouter();
    const { user } = useUser();
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [category, setCategory] = useState(initialCategory);
    const [postcode, setPostcode] = useState(user ? user.postcode : '');
    const [range, setRange] = useState(initialRange);

    useEffect(() => {
        if (user && user.postcode) {
            setPostcode(user.postcode);
        }
    }, [user]);

    const handleSearch = () => {
        router.push(`/search?query=${searchQuery}&category=${category}&postcode=${postcode}&range=${range}`);
    };

    return (
        <div className="flex flex-col lg:flex-row lg:join space-y-2 lg:space-y-0 lg:space-x-0 w-full">
            <input
                className="input input-bordered flex-grow lg:join-item"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
                className="select select-bordered flex-shrink-0 lg:join-item"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="" disabled selected>Filter</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Honey">Honey</option>
                <option value="Plants">Plants</option>
                <option value="Seeds">Seeds</option>
            </select>
            <input
                className="input input-bordered flex-grow lg:join-item"
                placeholder="Postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
            />
            <select
                className="select select-bordered flex-shrink-0 lg:join-item"
                value={range}
                onChange={(e) => setRange(e.target.value)}
            >
                <option value="0.5">0.5 miles</option>
                <option value="1">1 mile</option>
                <option value="2">2 miles</option>
                <option value="5">5 miles</option>
                <option value="10">10 miles</option>
                <option value="15">15 miles</option>
                <option value="20">20 miles</option>
                <option value="25">25 miles</option>
                <option value="30">30 miles</option>
            </select>
            <button className="btn btn-primary flex-shrink-0 lg:join-item" onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;
