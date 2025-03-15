import { useEffect, useRef } from "react";

const useCheckUser = (token, currentUser, setCurrentUser, setServerError, setLoading, setNavigateTo, location) => {
    const effectRan = useRef(false);

    useEffect(() => {
        if (!effectRan.current) {
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
                        if (location.pathname === "/signup" || location.pathname === "/login") return;

                        return setNavigateTo("/signup");
                    }
            
                    if (res.authenticated && (location.pathname === "/signup" || location.pathname === "/login")) {
                        setNavigateTo("/");
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
        }

        return () => effectRan.current = true;
    }, []);
}


const useFetchData = (token, currentUser, setCurrentUser, setData, setError, setLoading, setNavigateTo, url, expectedKey=null, location=null) => {
    const effectRan = useRef(false);

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
        if (!effectRan.current) {
            if (token && currentUser) {
                fetch(url, {
                    mode: "cors", 
                    method: "get",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }})
                .then(res => {
                    if (res.status === 404) {
                        throw new Error("404");
                    }
                    if (res.status > 401) {
                        throw new Error("Server error");
                    }
                    return res.json();
                })
                .then(res => {
                    if (res.error || res.authenticated === false) {
                        localStorage.clear();
                        setCurrentUser(null);
                        return setNavigateTo("/login");
                    }
            
                    if (res[expectedKey]) {
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
                setNavigateTo(goTo);
            }
        }

        return () => effectRan.current = true;
    }, arr);
}


const postData = async (token, currentUser, setCurrentUser, formData, setPostSuccess, setValidationError, setError, setLoading, setNavigateTo, url, expectedKey=null) => {

    if (token && currentUser) {
        return fetch(url, {
            mode: "cors",
            method: "post",
            body: JSON.stringify(formData),
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(async res => {
            try {
                const resBody = await res.json();
    
                if (res.status === 400 && resBody.validationErrors) {
                    return setValidationError(resBody.validationErrors);
                }

                if (res.status === 401 && (resBody.error || resBody.authenticated === false)) {
                    localStorage.clear();
                    setCurrentUser(null);
                    return;
                }

                if (res.status > 401) {
                    throw new Error();
                }
    
                if (resBody[expectedKey]) {
                    setPostSuccess(resBody[expectedKey]);
                }
    
            } catch (err) {
                throw new Error(err);
            }
        })            
        .catch(err => {
            setError(err);
        })
        .finally(() => {
            setLoading(false);
        });
    } else {
        setLoading(false);
        setNavigateTo("/signup");
    }
}


const handleInputChange = (event, setFormData) => {
    const { name, value } = event.target;
    setFormData(data => ({...data, [name]: value}));
}


const handleSubmitForm = (event, setLoading, callback) => {
        event.preventDefault();
        callback();
        setLoading(true);
    }


export {
    useCheckUser,
    useFetchData,
    postData,
    handleInputChange,
    handleSubmitForm
}