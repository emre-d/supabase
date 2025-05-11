import React from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useUser();

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-gray-800">
                            Project Manager
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-600 ">
                                    <p className='hover:underline'>Welcome, {user.username}</p>
                                </span>
                                <button
                                    onClick={logout}
                                    className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
