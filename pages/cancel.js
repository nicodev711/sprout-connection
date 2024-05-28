import Link from 'next/link';

const Cancel = () => {
    return (
        <div>
            <h1>Payment Cancelled</h1>
            <p>Your payment was not processed. You can try again or contact support.</p>
            <Link href="/">
                Go back to the dashboard
            </Link>
        </div>
    );
};

export default Cancel;
