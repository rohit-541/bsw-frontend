import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authData, setAuthData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const baseurl = `${config.baseURL}`;

    useEffect(() => {
        const storedAuthData = localStorage.getItem('authData');
        if (storedAuthData) {
            setAuthData(JSON.parse(storedAuthData));
        }
        setIsLoggedIn(localStorage.getItem('isAuthenticated'));
    }, []);

    const login = async (kerbrosId, password, userType) => {
        const endpoint = userType === "mentor" ? "/mentor/login" : "/user/login";
        
        try {
            const response = await fetch(`${baseurl}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ kerbrosId, password }),
                // credentials: 'include',
            });
            
            if (!response.ok) {
                throw new Error("Invalid credentials or server error");
            }
            
            const data = await response.json();
            console.log(data)
            setAuthData(data);
            localStorage.setItem("authData", JSON.stringify(data));
            localStorage.setItem("isAuthenticated", true);
            setIsLoggedIn(true);

            return true;
        } catch (error) {
            console.error("Login Error:", error.message);
            return false;
        }
    };

    const logout = async () => {
        const userType = authData?.userType || "user";  // Check if it's mentor or user
        const endpoint = userType === "mentor" ? "/mentor/logout" : "/user/logout";
        
        try {
            const response = await fetch(`${baseurl}${endpoint}`, {
                method: "POST",
                // credentials: 'include',
            });

            if (response.ok) {
                setAuthData(null);
                localStorage.removeItem("authData");
                localStorage.removeItem("isAuthenticated");
                setIsLoggedIn(false);
                navigate('/login');
            }
        } catch (error) {
            console.error("Logout Error:", error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ authData, isLoggedIn, login, logout, setIsLoggedIn, setAuthData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
