import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions</h1>
            <p className="text-gray-600 mb-4">Last updated: 03/06/2024</p>

            <p className="mb-4">Welcome to Sprout Connections!</p>

            <p className="mb-4">These terms and conditions outline the rules and regulations for the use of Sprout Connections&#39; Website, located at www.sproutconnections.com.</p>

            <p className="mb-4">By accessing this website, we assume you accept these terms and conditions. Do not continue to use Sprout Connections if you do not agree to take all of the terms and conditions stated on this page.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Definitions</h2>
            <p className="mb-2"><strong>Seller</strong>: An individual or entity that lists produce for sale on the Website.</p>
            <p className="mb-2"><strong>Buyer</strong>: An individual or entity that purchases produce from Sellers through the Website.</p>
            <p className="mb-4"><strong>User</strong>: Any individual who accesses or uses the Website.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Accounts</h2>
            <ol className="list-decimal ml-6 mb-4">
                <li className="mb-2">To access certain features of the Website, you may be required to create an account.</li>
                <li className="mb-2">You must provide accurate and complete information and keep your account information updated.</li>
                <li className="mb-2">You are responsible for safeguarding your account and for all activities that occur under your account.</li>
            </ol>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Listing and Selling Produce</h2>
            <ol className="list-decimal ml-6 mb-4">
                <li className="mb-2">Sellers must ensure that all listed produce complies with applicable local, UK national, and EU regulations.</li>
                <li className="mb-2">Sellers must have registered themselves as a food business with their local council in accordance with the Food Standards Agency (FSA) requirements and comply with all relevant food safety laws, including the Food Safety Act 1990, General Food Law Regulation (EC) 178/2002, and the Food Hygiene Regulations 2006.</li>
                <li className="mb-2">Sellers are responsible for the accuracy of their listings, including but not limited to product descriptions, prices, and availability.</li>
                <li className="mb-2">All transactions are solely between the Seller and Buyer. Sprout Connections is not responsible for any disputes arising from transactions.</li>
            </ol>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Buying Produce</h2>
            <ol className="list-decimal ml-6 mb-4">
                <li className="mb-2">Buyers must review all details and descriptions of produce before making a purchase.</li>
                <li className="mb-2">Buyers agree to pay the price listed for the produce plus any applicable taxes and shipping fees.</li>
                <li className="mb-2">Buyers assume all risk for the produce once it has been delivered.</li>
            </ol>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Payments and Fees</h2>
            <ol className="list-decimal ml-6 mb-4">
                <li className="mb-2">Payments for produce are processed through our third-party payment processor, Stripe. By using our service, you agree to Stripe&#39;s Terms of Service and Privacy Policy.</li>
                <li className="mb-2">Sprout Connections charges a platform fee for each transaction.</li> {/*The fee structure is detailed on the [Fees Page/Link].*/}
                <li className="mb-2">Sprout Connections is not responsible for payment issues arising from the third-party payment processor.</li>
            </ol>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Prohibited Activities</h2>
            <p className="mb-4">Users agree not to:</p>
            <ol className="list-decimal ml-6 mb-4">
                <li className="mb-2">Violate any laws or regulations.</li>
                <li className="mb-2">Post false, misleading, or deceptive content.</li>
                <li className="mb-2">Infringe on the intellectual property rights of others.</li>
                <li className="mb-2">Engage in any activity that disrupts or interferes with the Website.</li>
            </ol>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Intellectual Property</h2>
            <ol className="list-decimal ml-6 mb-4">
                <li className="mb-2">The content on the Website, including text, graphics, logos, and images, is the property of Sprout Connections and is protected by copyright and other intellectual property laws.</li>
                <li className="mb-2">Users are granted a limited license to access and use the Website for personal, non-commercial purposes.</li>
            </ol>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Limitation of Liability</h2>
            <ol className="list-decimal ml-6 mb-4">
                <li className="mb-2">Sprout Connections is not liable for any direct, indirect, incidental, special, or consequential damages arising from the use or inability to use the Website.</li>
                <li className="mb-2">Sprout Connections does not guarantee the quality, safety, or legality of any produce listed on the Website.</li>
            </ol>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Indemnification</h2>
            <p className="mb-4">Users agree to indemnify and hold harmless Sprout Connections, its affiliates, and its respective directors, officers, employees, and agents from any claims, liabilities, damages, and expenses arising out of or related to their use of the Website.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Termination</h2>
            <ol className="list-decimal ml-6 mb-4">
                <li className="mb-2">We may terminate or suspend your account and bar access to the Website immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</li>
                <li className="mb-2">Upon termination, your right to use the Website will cease immediately.</li>
            </ol>

            <h2 className="text-2xl font-bold mt-8 mb-4">11. Changes to Terms</h2>
            <ol className="list-decimal ml-6 mb-4">
                <li className="mb-2">We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically.</li>
                <li className="mb-2">By continuing to access or use our Website after any revisions become effective, you agree to be bound by the revised terms.</li>
            </ol>

            <h2 className="text-2xl font-bold mt-8 mb-4">12. Governing Law</h2>
            <p className="mb-4">These Terms shall be governed and construed in accordance with the laws of England, Wales and Scotland, without regard to its conflict of law provisions.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">13. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at contact@sproutconnections.com.</p>
        </div>
    );
};

export default TermsAndConditions;
