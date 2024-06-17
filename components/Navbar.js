// components/Navbar.js
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import SearchBar from './SearchBar';

const Navbar = () => {
    const { user, logout } = useUser();
    const { state } = useCart(); // Get the cart state
    const router = useRouter();
    const [basketCount, setBasketCount] = useState(0);

    useEffect(() => {
        // Update basket count whenever cart state changes
        setBasketCount(state.items.length);
    }, [state.items]);

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"/>
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52">
                        <li><Link href={'/search'}>Search</Link></li>
                        <li><Link href={'/faq'}>FAQ&#39;s</Link></li>
                        {user ? (<>
                            <li><Link href={'/dashboard'}>Dashboard</Link></li>
                        </>) : (<></>)}
                    </ul>
                </div>
                <Link href="/" className="text-sm sm:text-xl">
                    <Image src={'/logo-noBackground - Copy.png'} alt={'logo'} width={50} height={50} className={'ml-5'}/>
                </Link>
                <h2 className="text-sm ml-10 font-bold sm:text-xl">Sprout Connections</h2>
            </div>
            <div className="navbar-center hidden lg:flex">
                <SearchBar />
            </div>
            {user ? (
                <div className="navbar-end">
                    <ul className="menu menu-horizontal px-1 hidden lg:flex">
                        <li><Link href="/dashboard">Dashboard</Link></li>
                    </ul>
                    <Link href="/basket">
                        <button className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a1 1 0 0 0 .76.61l12.69.88a1 1 0 0 0 1-.77l1.24-7.45a1 1 0 0 0-.93-1.18L5.31 2H1z" />
                                </svg>
                                {basketCount > 0 && (
                                    <span className="badge badge-sm indicator-item">{basketCount}</span>
                                )}
                            </div>
                        </button>
                    </Link>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full relative">
                                <Image alt="User Avatar" src="/avatar.png" layout="fill" objectFit="cover" className="rounded-full"/>
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <Link href="/profile" className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </Link>
                            </li>
                            <li>
                                <a onClick={logout}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="navbar-end">
                    <Link href="/basket">
                        <button className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a1 1 0 0 0 .76.61l12.69.88a1 1 0 0 0 1-.77l1.24-7.45a1 1 0 0 0-.93-1.18L5.31 2H1z" />
                                </svg>
                                {basketCount > 0 && (
                                    <span className="badge badge-sm indicator-item">{basketCount}</span>
                                )}
                            </div>
                        </button>
                    </Link>
                    <div className="" data-tip="">
                        <Link href="/login" className="btn">
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
