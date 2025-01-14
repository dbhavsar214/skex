// components/Header.tsx
'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
    const router = useRouter();
    const [userID, setUserID] = useState<string | null>(null);

    useEffect(() => {
        const storedUserID = sessionStorage.getItem('userID');
        if (!storedUserID) {
            router.push('/login');
        } else {
            setUserID(storedUserID);
        }   
    }, [router]);

    return (
        <header className="bg-black text-white py-4 px-6">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">SKEX</h1>
                <nav>
                    {isLoggedIn ? (
                        <ul className="flex space-x-4">
                            <li>
                                {userID ? (
                                    <Link href={`/portfolio/${userID}`} className="hover:text-gray-400">
                                        Portfolio
                                    </Link>
                                ) : (
                                    <span className="text-gray-400">Portfolio</span>
                                )}
                            </li>
                        </ul>
                    ) : (
                        <ul className="flex space-x-4">
                            <li>
                                <Link href="/login" className="hover:text-gray-400">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/signup" className="hover:text-gray-400">
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
