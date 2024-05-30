import { useEffect, useState } from 'react';

export default function Statistics({ token }) {
    const [statistics, setStatistics] = useState({
        productsListed: 0,
        withdrawableAmount: 0,
        messages: 0,
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch('/api/statistics', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setStatistics(data);
                } else {
                    console.error('Failed to fetch statistics');
                }
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStatistics();
    }, [token]);

    return (
        <section className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Statistics</h2>
            <div className="flex justify-around mt-4">
                <div>
                    <h3 className="text-lg font-semibold">Products Listed</h3>
                    <p>{statistics.productsListed}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Withdrawable Amount</h3>
                    <p>£{statistics.withdrawableAmount.toFixed(2)}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Messages</h3>
                    <p>{statistics.messages}</p>
                </div>
            </div>
        </section>
    );
}
