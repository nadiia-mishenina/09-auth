'use client'

import Loader from "@/app/loading";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useEffect, useState } from "react";

type Props = {
    children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
    const [isLoading, setIsLoading] = useState(true)

    const setUser = useAuthStore((state) => state.setUser);
    const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

    useEffect(() => {
        const fetchUser = async () => {
            const isAuthenticated = await checkSession();

            if (isAuthenticated) {

                const user = await getMe();
                if (user) setUser(user);
            } else {
                clearIsAuthenticated();
            };
            setIsLoading(false);
        };
        fetchUser();

    }, [setUser, clearIsAuthenticated]);

    if (isLoading) return <Loader />
    return children;
}

export default AuthProvider;