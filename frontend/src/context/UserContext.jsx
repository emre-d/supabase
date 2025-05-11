import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../helper/supabaseClient';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchUserFromBackend = async (supaId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8010/api/users/by-supa-id/${supaId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                return data; 
            } else {
                throw new Error(data.error || 'Failed to fetch user from backend');
            }
        } catch (error) {
            console.error('Error fetching user from backend:', error.message);
            return null;
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                console.error('Error fetching Supabase user:', error?.message);
                setUser(null);
                setLoading(false);
                return;
            }

            const backendUser = await fetchUserFromBackend(user.id);
            if (backendUser) {
                setUser(backendUser); 
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const backendUser = await fetchUserFromBackend(session.user.id);
                if (backendUser) {
                    setUser(backendUser);
                } else {
                    setUser(null);
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            setUser(null);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserContext;