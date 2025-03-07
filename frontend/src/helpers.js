import { useEffect } from "react";

const useCheckUser = (token, currentUser, setCurrentUser, setServerError, setLoading, navigate) => {

    useEffect(() => {
        if (token && currentUser) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
                method: "get",
                mode: "cors",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(res => {
                if (res.status > 401) {
                    throw new Error();
                }
                return res.json();
            })
            .then(res => {
                if (res.error || res.authenticated === false) {
                    localStorage.clear();
                    setCurrentUser(null);
                    return;
                }
        
                if (res.authenticated) {
                    navigate("/");
                }
            })
            .catch(err => {
                setServerError(err);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);
}


const useFetchData = (token, currentUser, setCurrentUser, setData, setError, setLoading, navigate, url, expectedKey=null, location=null) => {
    let arr = [];
    if (location && expectedKey === 'notifications') {
        arr = [location];
    }

    let goTo = "";
    if (location && (location.pathname === "/signup" || location.pathname === "/login")) {
        goTo = location.pathname;
    } else {
        goTo = "/signup";
    }

    useEffect(() => {
        if (token && currentUser) {
            fetch(url, {
                mode: "cors", 
                method: "get",
                headers: {
                    "Authorization": `Bearer ${token}`
                }})
            .then(res => {
                if (res.status > 401) {
                    throw new Error("Server error");
                }
                return res.json();
            })
            .then(res => {
                if (res.error || res.authenticated === false) {
                    localStorage.clear();
                    setCurrentUser(null);
                    return navigate("/login");
                }
        
                if (expectedKey) {
                    setData(res[expectedKey]);
                } else {
                    setData(res);
                }
            })
            .catch(err => {
                console.error(err);
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
            navigate(goTo);
        }
    }, arr);
}


const handleInputChange = (event, setFormData) => {
    const { name, value } = event.target;
    setFormData(data => ({...data, [name]: value}));
}


const handleSubmitForm = (event, setLoading, callback) => {
        event.preventDefault();
        setLoading(true);
        callback();
    }


export {
    useCheckUser,
    useFetchData,
    handleInputChange,
    handleSubmitForm
}