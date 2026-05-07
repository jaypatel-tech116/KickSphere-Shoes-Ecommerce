import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-9xl font-extrabold text-[#1F1F1F]">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-white tracking-tight">Admin Route Not Found</h2>
          <p className="mt-2 text-sm text-gray-400">
            The admin page you're looking for doesn't exist.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#E8000D] hover:bg-[#C2000B]"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
