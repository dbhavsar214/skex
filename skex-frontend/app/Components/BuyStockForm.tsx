'use client'
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';

interface BuyStockFormValues {
    stockSymbol: string;
    quantity: number;
}

const buyStockSchema = yup.object().shape({
    stockSymbol: yup.string().required('Stock symbol is required'),
    quantity: yup
        .number()
        .typeError('Quantity must be a number')
        .positive('Quantity must be a positive number')
        .integer('Quantity must be an integer')
        .required('Quantity is required'),
});

const BuyStockForm: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const userToken = sessionStorage.getItem('token');
    const userID = sessionStorage.getItem('userID');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { register, handleSubmit, setValue, formState: { errors }, watch, reset } = useForm<BuyStockFormValues>({
        resolver: yupResolver(buyStockSchema),
        defaultValues: {
            stockSymbol: '',
            quantity: 0,
        },
    });

    useEffect(() => {
        const stksymbol: string = params.stocksymbol ? params.stocksymbol.toString() : '';

        if (!userToken || !userID) {
            router.push('/login');
        }

        if (stksymbol) {
            setValue('stockSymbol', stksymbol, { shouldDirty: true, shouldTouch: true });
        }
    }, [params.stocksymbol, setValue, userToken, userID, router]);

    const onSubmit: SubmitHandler<BuyStockFormValues> = async (data) => {
        const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const combinedData = { ...data, userID: userID };

        try {
            const response = await fetch(`${apiUrl}/trade/buy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(combinedData),
            });

            if (response.status === 401) {
                setErrorMessage('Unauthorized. Please log in.');
                return;
            }

            if (response.status === 200) {
                const data = await response.json();
                router.push('/');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'An unexpected error occurred.');
            }

        } catch (error) {
            console.error('Error during request:', error);
            setErrorMessage('An unexpected error occurred.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Buy Stock</h2>
            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="stockSymbol" className="block text-sm font-medium text-gray-700">Stock Symbol</label>
                    <input
                        id="stockSymbol"
                        type="text"
                        {...register('stockSymbol')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                        readOnly
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
                    Buy Stock
                </button>
            </form>
        </div>
    );
};

export default BuyStockForm;
