// pages/faq.js
import React from 'react';
import Head from "next/head";

const FAQ = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Head>
                <title>Sprout Connections - FAQ</title>
                <meta name="description"
                      content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!"/>
                <meta property="og:title" content="Sprout Connections - Fresh Garden Produce from Your Neighbors"/>
                <meta property="og:description"
                      content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!"/>
                <meta property="og:url" content="https://www.sproutconnections.com"/>
            </Head>
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-green-600 mb-8">Frequently Asked Questions</h1>

                <div className="collapse collapse-arrow bg-base-200 mb-4">
                    <input type="radio" name="faq-accordion" id="gardener-section" defaultChecked/>
                    <div className="collapse-title text-xl font-semibold text-gray-800">
                        For Gardeners
                    </div>
                    <div className="collapse-content">
                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="gardener-accordion" id="gardener-q1"/>
                                <div className="collapse-title text-lg font-medium text-gray-700">
                                    How does the payment process work?
                                </div>
                                <div className="collapse-content bg-base-100 pt-2">
                                    <p className="text-gray-600">
                                        When a buyer purchases your produce, the payment is processed through Stripe.
                                        Once the transaction is completed, the funds will be transferred to your Stripe
                                        account. Stripe will proceed with a payout every day.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="gardener-accordion" id="gardener-q2"/>
                                <div className="collapse-title text-lg font-medium text-gray-700">
                                    How long do I need to wait to receive the money?
                                </div>
                                <div className="collapse-content bg-base-100 pt-2">
                                    <p className="text-gray-600">
                                        Payments are typically transferred to your Stripe account immediately after a
                                        purchase is made. Since Stripe processes payouts every day, the funds should be
                                        available in your bank account within a few business days, depending on your
                                        bank&#39;s processing times.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="gardener-accordion" id="gardener-q3"/>
                                <div className="collapse-title text-lg font-medium text-gray-700">
                                    What fees are associated with selling on this platform?
                                </div>
                                <div className="collapse-content bg-base-100 pt-2">
                                    <p className="text-gray-600">
                                        There are no fees for gardeners to sell on our platform. This ensures you can keep more of your earnings.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="gardener-accordion" id="gardener-q4"/>
                                <div className="collapse-title text-lg font-medium text-gray-700">
                                    How do I link my bank account to receive payments?
                                </div>
                                <div className="collapse-content bg-base-100 pt-2">
                                    <p className="text-gray-600">
                                        During the registration process, you&#39;ll be guided to set up a Stripe account
                                        where you can link your bank account. If you didn&#39;t complete this step, you
                                        can update your payment information in the account settings at any time.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="gardener-accordion" id="gardener-q5"/>
                                <div className="collapse-title text-lg font-medium text-gray-700">
                                    What happens if a buyer requests a refund?
                                </div>
                                <div className="collapse-content bg-base-100 pt-2">
                                    <p className="text-gray-600">
                                        If a buyer requests a refund, our support team will review the request and may
                                        contact you for additional information. If the refund is approved, the amount
                                        will be deducted from your next payout.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="gardener-accordion" id="gardener-q6"/>
                                <div className="collapse-title text-lg font-medium text-gray-700">
                                    How do I track my sales and earnings?
                                </div>
                                <div className="collapse-content bg-base-100 pt-2">
                                    <p className="text-gray-600">
                                        You can track your sales and earnings in your dashboard. Detailed reports will
                                        be available, showing your transactions, pending payments, and total earnings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="collapse collapse-arrow bg-base-200 mb-4">
                    <input type="radio" name="faq-accordion" id="buyer-section"/>
                    <div className="collapse-title text-xl font-semibold text-gray-800">
                        For Buyers
                    </div>
                    <div className="collapse-content">
                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="buyer-accordion" id="buyer-q1"/>
                                <div className="collapse-title text-lg font-medium text-gray-700">
                                How do I purchase produce from a gardener?
                                </div>
                                <div className="collapse-content bg-base-100 pt-2">
                                    <p className="text-gray-600">
                                        Browse the listings on our platform, select the produce you wish to purchase, and proceed to checkout. You can pay securely using your preferred payment method.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="buyer-accordion" id="buyer-q2" />
                                <div className="collapse-title text-lg font-medium text-gray-700">
                                    What payment methods are accepted?
                                </div>
                                <div className="collapse-content bg-base-100 pt-2">
                                    <p className="text-gray-600">
                                        We accept all major credit and debit cards, as well as other secure payment options through Stripe.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="buyer-accordion" id="buyer-q3" />
                                <div className="collapse-title text-lg font-medium text-gray-700">
                                    How do I know if the produce is fresh and of good quality?
                                </div>
                                <div className="collapse-content bg-base-100 pt-2">
                                    <p className="text-gray-600">
                                        Gardeners on our platform are required to provide detailed descriptions and images of their produce. Additionally, you can check reviews and ratings from other buyers to ensure the quality of the produce.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="buyer-accordion" id="buyer-q4" />
                                <div className="collapse-title text-lg font-medium text-gray-700">
                                    Can I cancel my order after it has been placed?
                                </div>
                                <div className="collapse-content bg-base-100 pt-2">
                                    <p className="text-gray-600">
                                        You can request to cancel your order by contacting the gardener directly through our messaging system. However, cancellations are subject to the gardener&#39;s approval and our platform&#39;s cancellation policy.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="buyer-accordion" id="buyer-q5" />
                                <div className="collapse-title text-lg font-medium text-gray-700">
                                    How do I leave a review for a gardener?
                                </div>
                                <div className="collapse-content bg-base-100 pt-2">
                                    <p className="text-gray-600">
                                        After receiving your order, you will have the option to leave a review on the gardener&#39;s profile. Your feedback helps other buyers make informed decisions and encourages gardeners to maintain high-quality standards. [We are still working on this feature]
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="buyer-accordion" id="buyer-q6" />
                                <div className="collapse-title text-lg font-medium text-gray-700">
                                    What should I do if I have an issue with my order?
                                </div>
                                <div className="collapse-content bg-base-100 pt-2">
                                    <p className="text-basic-100">
                                        If you encounter any issues with your order, please contact the gardener directly through our messaging system. If the issue is not resolved, you can escalate the matter to our support team for further assistance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <h3 className="text-xl font-medium text-gray-800">Additional Questions?</h3>
                    <p className="text-gray-600">If you have any other questions or need further assistance, please contact our support team at <a href="mailto:contact@sproutconnections.com" className="text-green-600 hover:underline">contact@sproutconnections.com</a>. We are here to help you have the best experience on our platform.</p>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
