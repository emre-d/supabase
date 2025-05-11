import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
                        <Routes>
                            {/* Giriş yapılmamışsa /login'e yönlendirecek yollar */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                            </Route>
                            {/* Giriş ve kayıt sayfaları koruma gerektirmez */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </UserProvider>
    );
};

export default App;