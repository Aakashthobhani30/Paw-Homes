import { useState, useEffect } from "react";
import api from "../api"; 
import { ACCESS_TOKEN } from "../constants";

const useUser = () => {
        const [user, setUser] = useState(null)
        const [isloading, setIsloading] = useState(null)
    
        useEffect(() => {
            const fetchUserData = async () => {
                const token = localStorage.getItem(ACCESS_TOKEN)
                if (!token) {
                    console.error("Np Token Found!");
                    setIsloading(false)
                    return;
                }
    
                try{
                    const response = await api.get("/api/user/", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                } finally {
                    setIsloading(false);
                }
            };
    
            fetchUserData();
        }, []);
    
        return { user, isloading };
}

export default useUser;