import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple unsecured client-side check for demo purposes
        // User can customize this pin
        if (password === '1234') {
            localStorage.setItem('admin_auth', 'true');
            navigate('/admin/dashboard');
        } else {
            alert('Invalid Access Code');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-serif font-bold text-center mb-6 text-primary">Admin Access</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            placeholder="Enter Access Code"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded focus:outline-none focus:border-primary transition-colors text-center text-lg tracking-widest"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-4 font-bold uppercase tracking-wider hover:bg-accent transition-colors"
                    >
                        Enter Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};
