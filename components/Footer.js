import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-secondary text-white text-center py-6">
            <p>&copy; {new Date().getFullYear()} Sprout Connections. All rights reserved.</p>
            <nav className="mt-4">
                <Link href="/terms-and-conditions" className="link link-hover mx-2 text-white">
                    Terms and Conditions
                </Link>
                <Link href="/privacy-policy" className="link link-hover mx-2 text-white">
                    Privacy Policy
                </Link>
                <a href="#" className="link link-hover mx-2 hidden">About Us</a>
                <a href="mailto:contact@sproutconnections.com"
                   className="link link-hover mx-2">Contact</a>
                <Link href="/faq" className="link link-hover mx-2 text-white">
                    FAQs
                </Link>
            </nav>
        </footer>
    )
}