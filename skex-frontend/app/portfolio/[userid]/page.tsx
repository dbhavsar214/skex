'use client'

import React, { useEffect, useState } from 'react'
import Portfolio from '@/app/Components/Portfolio';

const Page = () => {

    const [stocks, setStocks] = useState<any[]>([]);

    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        const userID = sessionStorage.getItem('userID');


        const fetchData = async () => {
            try {
                // Fetch data from your backend API
                const response = await fetch(`${apiUrl}/user/${userID}/getUserStocks`);
                const data = await response.json();


                setStocks(data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (userID) {
            fetchData();
        } else {
            console.warn('User ID not found in sessionStorage');
        }

    }, [apiUrl]);

    return (
        <div>
            <Portfolio stocks={stocks} />
        </div>
    )
}

export default Page;
