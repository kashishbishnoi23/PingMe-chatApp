import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-8">
                <h1 className="text-7xl font-bold text-gray-800">404</h1>
                <h2 className="text-xl font-semibold text-gray-700 mt-4">Oops! Page Not Found</h2>
                <p className="text-gray-600 mt-4 mb-8">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/" 
                    className="px-6 py-3 bg-[#009dd3] text-white rounded-lg hover:bg-[#009ed3dd] transition-colors duration-300"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;