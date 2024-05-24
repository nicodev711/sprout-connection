import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import {UserProvider} from "@/contexts/UserContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from "@/components/Footer";


export default function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
            <Navbar />
            <Component {...pageProps} />
            <Footer/>
        </UserProvider>
    );
}