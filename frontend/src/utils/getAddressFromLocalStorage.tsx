'use client'
export const getAddressFromLocalStorage = () => {
    if (typeof window !== "undefined") {
        const address = localStorage.getItem('address');
        return address;
    }
    return null;
};