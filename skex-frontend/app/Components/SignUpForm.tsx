// components/SignupForm.tsx
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from 'next/navigation';

interface SignupFormValues {
    email: string;
    sin_number: string;
    password: string;
}

const signupSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    sin_number: yup.string().min(9, 'SIN number must be at least 9 characters').required('SIN number is required'),
}).required();

type SignUpFormType = yup.InferType<typeof signupSchema>;
const SignupForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>();
    const router = useRouter();

    const onSubmit = async (data: SignupFormValues) => {
        const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

        try {
            const response = await fetch(`${apiUrl}/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="sin" className="block text-sm font-medium text-gray-700">SIN Number</label>
                    <input
                        id="sin"
                        type="text"
                        {...register('sin_number', {
                            required: 'SIN Number is required',
                            pattern: {
                                value: /^\d{9}$/,
                                message: 'SIN Number must be 9 digits',
                            },
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    {errors.sin_number && <p className="text-red-500 text-sm">{errors.sin_number.message}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignupForm;
