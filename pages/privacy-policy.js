// pages/privacy-policy.js

import Head from 'next/head';

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto p-4">
            <Head>
                <title>Sprout Connections - Privacy Policy</title>
                <meta name="description"
                      content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!"/>
                <meta property="og:title" content="Sprout Connections - Fresh Garden Produce from Your Neighbors"/>
                <meta property="og:description"
                      content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!"/>
                <meta property="og:url" content="https://www.sproutconnections.com"/>
            </Head>
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p>Last updated: 3/06/2024</p>

            <h2 className="text-2xl font-bold mt-6">1. Introduction</h2>
            <p>
                Sprout Connections (&#34;we&#34;, &#34;our&#34;, &#34;us&#34;) is committed to protecting and respecting your privacy.
                This Privacy Policy explains how we collect, use, and share information about you when you visit our website
                www.sproutconnections.com (the &#34;Site&#34;), and use our services.
            </p>
            <p>
                By using our Site and services, you agree to the collection and use of information in accordance with this policy.
            </p>

            <h2 className="text-2xl font-bold mt-6">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mt-4">2.1 Personal Data</h3>
            <p>We may collect the following types of personal data about you:</p>
            <ul className="list-disc list-inside ml-4">
                <li>Contact Information: Name, email address, postal address, phone number.</li>
                <li>Account Information: Username, password, profile information.</li>
                <li>Transaction Information: Purchase and sale details, payment information.</li>
                <li>Technical Data: IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access the Site.</li>
                <li>Usage Data: Information about how you use our Site and services.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">2.2 Non-Personal Data</h3>
            <p>
                We may collect, use, and share aggregated data such as statistical or demographic data for any purpose.
                Aggregated data may be derived from your personal data but is not considered personal data as it does not reveal your identity.
            </p>

            <h2 className="text-2xl font-bold mt-6">3. How We Use Your Information</h2>
            <p>We use the information we collect in the following ways:</p>
            <ul className="list-disc list-inside ml-4">
                <li>To Provide Our Services: To process transactions, manage your account, and provide customer support.</li>
                <li>To Improve Our Services: To understand how our services are used and to improve them.</li>
                <li>To Communicate with You: To send you updates, newsletters, marketing materials, and other information that may be of interest to you.</li>
                <li>To Ensure Security and Compliance: To ensure the security of our Site and services and to comply with legal obligations.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6">4. Sharing Your Information</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc list-inside ml-4">
                <li>Service Providers: Third-party vendors who provide services such as payment processing (e.g., Stripe), data analysis, email delivery, hosting services, and customer service.</li>
                <li>Legal Requirements: If required by law or in response to legal process, we may disclose your information to law enforcement or other government officials.</li>
                <li>Business Transfers: In the event of a merger, acquisition, or sale of assets, your personal data may be transferred to the acquiring entity.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6">5. Data Security</h2>
            <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                However, no method of transmission over the internet or method of electronic storage is completely secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold mt-6">6. Your Rights</h2>
            <p>Under GDPR, you have the following rights:</p>
            <ul className="list-disc list-inside ml-4">
                <li>Access: You have the right to request a copy of the personal data we hold about you.</li>
                <li>Rectification: You have the right to request that we correct any inaccuracies in your personal data.</li>
                <li>Erasure: You have the right to request that we delete your personal data.</li>
                <li>Restriction: You have the right to request that we restrict the processing of your personal data.</li>
                <li>Data Portability: You have the right to request a copy of your personal data in a structured, commonly used, and machine-readable format.</li>
                <li>Objection: You have the right to object to the processing of your personal data.</li>
            </ul>
            <p>
                To exercise any of these rights, please contact us at [Your Contact Information].
            </p>

            <h2 className="text-2xl font-bold mt-6">7. Cookies</h2>
            <p>
                Our Site uses cookies to enhance your experience and analyze site usage. For detailed information on the cookies we use and the purposes for which we use them,
                please see our [Cookie Policy].
            </p>

            <h2 className="text-2xl font-bold mt-6">8. Changes to This Privacy Policy</h2>
            <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>

            <h2 className="text-2xl font-bold mt-6">9. Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy, please contact us at contact@sproutconnections.com.
            </p>
        </div>
    );
}
