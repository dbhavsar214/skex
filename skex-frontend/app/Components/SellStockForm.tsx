'use client';
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';

interface SellStockFormValues {
    stockSymbol: string;
    quantity: number;
}

const sellStockSchema = yup.object().shape({
    stockSymbol: yup.string().required('Stock symbol is required'),
    quantity: yup
        .number()
        .typeError('Quantity must be a number')
        .positive('Quantity must be a positive number')
        .integer('Quantity must be an integer')
        .required('Quantity is required'),
});

const SellStockForm: React.FC = () => {
    const params = useParams(); // Read stockSymbol from params
    const router = useRouter();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<SellStockFormValues>({
        resolver: yupResolver(sellStockSchema),
        defaultValues: {
            stockSymbol: '',
            quantity: 0,
        },
    });

    useEffect(() => {
        const stksymbol: string = params.stocksumbol ? params.stocksumbol.toString() : '';
        // Debugging line

        const userToken = sessionStorage.getItem('token');
        const userID = sessionStorage.getItem('userID');

        if (!userToken || !userID) {
            router.push('/login');
            return;
        }

        if (stksymbol) {
            setValue('stockSymbol', stksymbol, { shouldDirty: true, shouldTouch: true });
        }
    }, [params.stocksymbol, setValue, router]); // Correct dependencies

    const onSubmit: SubmitHandler<SellStockFormValues> = async (data) => {
        const userID = sessionStorage.getItem('userID'); // Get userID inside onSubmit
        if (!userID) {
            console.error('User ID is missing');
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const combinedData = { ...data, userID };
        

        try {
            const response = await fetch(`${apiUrl}/trade/sell`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(combinedData),
            });

            if (response.status === 401) {
                console.error('Unauthorized request');
                router.push('/login'); // Redirect to login page
                return;
            }

            if (response.status === 200) {
                const responseData = await response.json();
                router.push('/');
            } else {
                const errorData = await response.json();
                console.error('API Error:', errorData.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error during request:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Sell Stock</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="stockSymbol" className="block text-sm font-medium text-gray-700">Stock Symbol</label>
                    <input
                        id="stockSymbol"
                        type="text"
                        {...register('stockSymbol')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                        disabled // Make the stockSymbol input read-only
                    />
                    {errors.stockSymbol && <p className="text-red-500 text-sm">{errors.stockSymbol.message}</p>}
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        id="quantity"
                        type="number"
                        {...register('quantity')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                >
                    Sell Stock
                </button>
            </form>
        </div>
    );
};

export default SellStockForm;
