// src/contexts/UserContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            setUser(data.user);
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const logout = async () => {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            setUser(null);
            router.push('/');
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
