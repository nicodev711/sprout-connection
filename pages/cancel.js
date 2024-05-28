import Link from 'next/link';

const Cancel = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4 text-red-600">Payment Cancelled</h1>
                <p className="text-lg text-gray-700 mb-6">Your payment was not processed. You can try again or contact support.</p>
                <Link href="/" className="btn btn-primary px-4 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition duration-300">
                    Go back to the dashboard
                </Link>
            </div>
        </div>
    );
};

export default Cancel;
