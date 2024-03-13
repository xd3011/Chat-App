import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            // console.log('got user: ', user);
            if (user) {
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            }
            else {
                setIsAuthenticated(false);
                setUser(null);
            }
        })
        return unsub;
    }, []);

    const updateUserData = async (userId) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let data = docSnap.data();
            setUser(prevUser => ({
                ...prevUser,
                username: data.username,
                profileUrl: data.profileUrl,
                userId: data.userId
            }));
        }
    };

    const register = async (email, password, username, profileUrl) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('response.user: ', response?.user);

            // setUser(response?.user);
            // setIsAuthenticated(true);
            await setDoc(doc(db, 'users', response?.user?.uid), {
                username,
                profileUrl,
                userId: response?.user?.uid,
            });

            return { success: true, data: response?.user };
        } catch (error) {
            let message = error.message;
            if (message.includes('(auth/invalid-email)')) {
                message = 'Invalid email';
            } else if (message.includes('(auth/email-already-in-use)')) {
                message = 'This email is already in use';
            };
            return { success: false, message };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            let message = error.message;
            if (message.includes('(auth/invalid-email)')) {
                message = 'Invalid email';
            } else if (message.includes('(auth/invalid-credential)')) {
                message = 'Wrong credentials';
            };
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error('useAuth must be wrapped inside AuthContextProvider')
    };

    return value;
}