'use client'
import React from 'react';

interface Stock {
    quantity: number;
    stockSymbol: string;
    stockName: string;
}

interface PortfolioProps {
    stocks: Stock[];
}

const Portfolio: React.FC<PortfolioProps> = ({ stocks }) => {
    // Add this line

    return (
        <div className="overflow-x-auto p-16">
            {stocks.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock Symbol
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock Name
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {stocks.map((stock, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.stockSymbol}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.stockName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500">No stocks available</p>
            )}
        </div>
    );
}

export default Portfolio;
