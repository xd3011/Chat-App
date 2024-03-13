import React, { useEffect } from 'react'
import { Slot, useSegments, useRouter } from 'expo-router'
import "../global.css"
import { AuthContextProvider, useAuth } from '../context/authContext'
import { MenuProvider } from 'react-native-popup-menu';

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (typeof isAuthenticated == 'undefined') return;
        const inApp = segments[0] == '(app)';
        if (isAuthenticated && !inApp) {
            router.replace('home');
        } else if (!isAuthenticated) {
            router.replace('signIn');
        }
    }, [isAuthenticated])

    return <Slot />
}


const RootLayout = () => {
    return (
        <MenuProvider>
            <AuthContextProvider>
                <MainLayout />
            </AuthContextProvider>
        </MenuProvider>
    )
}

export default RootLayout