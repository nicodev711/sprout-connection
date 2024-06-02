import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-secondary text-white text-center py-6">
            <p>&copy; {new Date().getFullYear()} Sprout Connections. All rights reserved.</p>
            <nav className="mt-4">
                <Link href="/terms-and-conditions" className="link link-hover mx-2 text-white">
                   Terms and Conditions
                </Link>
                <a href="#" className="link link-hover mx-2">About Us</a>
                <a href="#" className="link link-hover mx-2">Contact</a>
                <a href="#" className="link link-hover mx-2">FAQs</a>
            </nav>
        </footer>
    )
}