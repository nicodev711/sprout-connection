import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    const { user, logout } = useUser();

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                {/*<div className="dropdown">*/}
                {/*    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">*/}
                {/*        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"*/}
                {/*             stroke="currentColor">*/}
                {/*            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"*/}
                {/*                  d="M4 6h16M4 12h8m-8 6h16"/>*/}
                {/*        </svg>*/}
                {/*    </div>*/}
                {/*    <ul tabIndex={0}*/}
                {/*        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">*/}
                {/*        <li><a>Item 1</a></li>*/}
                {/*        <li>*/}
                {/*            <a>Parent</a>*/}
                {/*            <ul className="p-2">*/}
                {/*                <li><a>Submenu 1</a></li>*/}
                {/*                <li><a>Submenu 2</a></li>*/}
                {/*            </ul>*/}
                {/*        </li>*/}
                {/*        <li><a>Item 3</a></li>*/}
                {/*    </ul>*/}
                {/*</div>*/}
                <Link href="/" className="text-sm sm:text-xl">
                    <Image src={'/logo-noBackground - Copy.png'} alt={'logo'} width={50} height={50} className={'ml-5'}/>
                </Link>
                <h2 className="text-sm ml-10 font-bold sm:text-xl">Sprout Connection</h2>
            </div>
            <div className="navbar-center hidden lg:flex">
                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered"
                    />
                </div>
            </div>
            {user ? (
                <div className="navbar-end">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link href="/dashboard">Dashboard</Link></li>
                    </ul>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full relative">
                                <Image
                                    alt="User Avatar"
                                    src="/avatar.png"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                        <ul tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
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
                    <div className={"tooltip tooltip-left tooltip-primary"} data-tip={"We are currently working on it. 😊"}>
                        <Link href="/login" className="btn" disabled>
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
