const getLocalItem = (key: string): string | null => {
    if (typeof window === "undefined") {
        // Server-side rendering, localStorage is not available
        return null;
    }
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error("Error accessing localStorage:", error);
        return null;
    }
};

const setLocalItem = (key: string, value: string): void => {
    if (typeof window === "undefined") {
        // Server-side rendering, localStorage is not available
        return;
    }
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error("Error accessing localStorage:", error);
    }
}

export { getLocalItem ,setLocalItem}  ;