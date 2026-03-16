import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link to="/" className="inline-block">
          <span className="text-3xl font-bold text-red-600">🩸 DarahKita</span>
        </Link>
        <p className="text-gray-500 text-sm mt-2">Platform Donor Darah Indonesia</p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <Outlet />
      </div>
      <p className="text-center text-gray-400 text-xs mt-6">© 2024 DarahKita. Semua hak dilindungi.</p>
    </div>
  </div>
);

export default AuthLayout;
