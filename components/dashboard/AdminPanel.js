'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

// Dynamically import the MapComponent with no SSR
const MapComponent = dynamic(() => import('@/components/dashboard/MapComponent').then(mod => mod.MapComponent), {
    ssr: false,
});

const AdminPanel = () => {
    const [userCount, setUserCount] = useState(0);
    const [gardenerCount, setGardenerCount] = useState(0);
    const [userLocations, setUserLocations] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [categoryCounts, setCategoryCounts] = useState({
        Vegetables: 0,
        Fruits: 0,
        Honey: 0,
        Plants: 0,
        Seeds: 0,
    });

    useEffect(() => {
        // Fetch user data
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/admin/users');
                const users = response.data;
                setUserCount(users.length);
                setGardenerCount(users.filter(user => user.isGardener).length);
                setUserLocations(users.map(user => ({
                    lat: user.latitude,
                    lon: user.longitude,
                    isGardener: user.isGardener,
                })).filter(user => user.lat && user.lon)); // Filter out invalid coordinates
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Fetch product data
        const fetchProductData = async () => {
            try {
                const response = await axios.get('/api/products');
                const products = response.data;
                setProductCount(products.length);

                const categoryCounts = products.reduce((acc, product) => {
                    acc[product.category] = (acc[product.category] || 0) + 1;
                    return acc;
                }, {
                    Vegetables: 0,
                    Fruits: 0,
                    Honey: 0,
                    Plants: 0,
                    Seeds: 0,
                });

                setCategoryCounts(categoryCounts);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchUserData();
        fetchProductData();
    }, []);

    const pieData = {
        labels: ['Gardeners', 'Non-Gardeners'],
        datasets: [
            {
                data: [gardenerCount, userCount - gardenerCount],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    const productPieData = {
        labels: ['Vegetables', 'Fruits', 'Honey', 'Plants', 'Seeds'],
        datasets: [
            {
                data: Object.values(categoryCounts),
                backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384', '#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#FFCE56', '#36A2EB', '#FF6384', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Admin Panel</h1>
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl mb-4">User Count: <span className="font-semibold">{userCount}</span></h2>
                        <div className="flex justify-center">
                            <Pie data={pieData} />
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl mb-4">User Locations</h2>
                        <div className="h-96 w-full">
                            <MapComponent userLocations={userLocations} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl mb-4">Total Products: <span className="font-semibold">{productCount}</span></h2>
                        <div className="flex justify-center">
                            <Pie data={productPieData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
