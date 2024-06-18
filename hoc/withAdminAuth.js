// hoc/withAdminAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';

const withAdminAuth = (WrappedComponent) => {
    return (props) => {
        const { user } = useUser();
        const router = useRouter();

        useEffect(() => {
            if (!user) {
                router.push('/login');
            } else if (!user.isAdmin) {
                router.push('/');
            }
        }, [user, router]);

        if (!user || !user.isAdmin) {
            return <p>Loading...</p>;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAdminAuth;
