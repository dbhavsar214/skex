import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white py-4 px-6">
            <div className="container mx-auto text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} SKEX. All rights reserved.</p>
                <div className="mt-4">
                    <a href="/privacy-policy" className="hover:text-gray-400 mx-2">Privacy Policy</a>
                    <a href="/terms-of-service" className="hover:text-gray-400 mx-2">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;