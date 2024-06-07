// pages/register.js
import RegistrationForm from '@/components/RegistrationForm';
import Head from "next/head";

export default function Register() {
    return (
        <div>
            <Head>
                <title>Sprout Connections - Register</title>
                <meta name="description"
                      content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!"/>
                <meta property="og:title" content="Sprout Connections - Fresh Garden Produce from Your Neighbors"/>
                <meta property="og:description"
                      content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!"/>
                <meta property="og:url" content="https://www.sproutconnections.com"/>
            </Head>
            <RegistrationForm />
        </div>
    );
}
