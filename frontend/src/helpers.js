import { useEffect } from "react";

const useCheckUser = (token, currentUser, setCurrentUser, setServerError, setLoading, setNavigateTo) => {

    let goTo;
    if (window.location.pathname !== "/signup" && window.location.pathname !== "/login") {
        goTo = "/signup";
    }

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
            goTo ? setNavigateTo(goTo) : null;
        }

    }, []);
}


const useFetchData = (token, currentUser, setCurrentUser, setData, setError, setLoading, setNavigateTo, url, expectedKey=null, dependency=null) => {

    let arr = []
    if (dependency?.length) {
        arr = [...dependency]
    } else if (dependency) {
        arr = [dependency]
    }
    
    let goTo = "";
    if (window.location.pathname === "/signup" || window.location.pathname === "/login") {
        goTo = window.location.pathname;
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
                    setNavigateTo("/login", {replace: true});
                    localStorage.clear();
                    setCurrentUser(null);
                    return;
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
            setNavigateTo(goTo, {replace: true});
        }

    }, arr);
}



const getNewGuest = async (setCurrentUser, setServerError, setLoading, navigate) => {

    return fetch(`${import.meta.env.VITE_BACKEND_URL}/users/guest`, {
        method: 'get',
        mode: "cors"
    })
    .then(async res => {
        try {
            const resBody = await res.json();

            if (res.status >= 400) {
                throw new Error();
            }

            if (resBody.guest) {
                localStorage.setItem('token', resBody.token);
                localStorage.setItem('currentUserHandle', resBody.guest.userInfo.handle);
                setCurrentUser(resBody.guest);
                navigate("/", {replace: true});
            }

        } catch (err) {
            throw new Error(err);
        }
    })
    .catch(err => {
        setServerError(err);
    })
    .finally(() => {
        setLoading(false);
    });
}



const postData = async (token, currentUser, setCurrentUser, formData, setShouldUpdateUser, setValidationError, setError, setLoading, setNavigateTo, url, setModalShow=null, setPostSuccess=null) => {

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
                    setNavigateTo("/login", {replace: true});
                    localStorage.clear();
                    setCurrentUser(null);
                    return;
                }

                if (res.status > 401) {
                    throw new Error();
                }
                    
                if (setModalShow) {
                    setModalShow();
                }

                if (setPostSuccess) {
                    setPostSuccess(resBody);
                }

                setShouldUpdateUser(resBody);
    
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
        setNavigateTo("/signup", {replace: true});
    }
}


const putData = async (token, currentUser, setCurrentUser, setError, setLoading, setNavigateTo, url, formData=null, setPutSuccess=null, setValidationError=null, expectedKey=null, setFormData=null, setShouldUpdateUser=null) => {
    let form;
    if (formData) {
        form = new FormData();
        form.append("bio", formData.bio);
        form.append("name", formData.name);
        form.append("profile_pic", formData.profile_pic);
        form.append("banner_pic", formData.banner_pic);
    }

    
    if (token && currentUser) {
        return fetch(url, {
            mode: "cors",
            method: "put",
            body: form,
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }).then(async res => {
            try {
                const resBody = await res.json();
    
                if (res.status === 400 && resBody.validationErrors) {
                    setFormData ? setFormData({
                        name: currentUser?.userInfo.name,
                        bio: currentUser?.userInfo.bio,
                        profile_pic: null,
                        banner_pic: null
                    }) : null;
                    return setValidationError(resBody.validationErrors);
                }

                if (res.status === 401 && (resBody.error || resBody.authenticated === false)) {
                    setNavigateTo("/login", {replace: true});
                    localStorage.clear();
                    setCurrentUser(null);
                    return;
                }

                if (res.status > 401) {
                    throw new Error();
                }
    
                if (resBody[expectedKey] && setPutSuccess) {
                    setPutSuccess(resBody[expectedKey]);
                } else if (setPutSuccess) {
                    setPutSuccess(resBody);
                }

                if (setShouldUpdateUser) {
                    setShouldUpdateUser(resBody);
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
        })
    } else {
        setLoading(false);
        setNavigateTo("/signup", {replace: true});
    }
}


const deleteData = async (token, currentUser, setCurrentUser, setShouldUpdateUser, setExists, setCount=null, setError, setLoading, navigate, url, setModalShow=null) => {
    if (token && currentUser) {
        return fetch(url, {
            mode: "cors",
            method: "delete",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then(async res => {
            try {
                const resBody = await res.json();

                if (res.status === 401 && (resBody.error || resBody.authenticated === false)) {
                    navigate("/login", {replace: true});
                    localStorage.clear();
                    setCurrentUser(null);
                    return;
                }

                if (res.status > 401) {
                    throw new Error();
                }

                if (setModalShow) {
                    setModalShow(false);
                }

                if (setCount) {
                    setCount((oldCount) => oldCount - 1);
                }

                setExists(false);
                setShouldUpdateUser(resBody);
    
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
        navigate("/signup", {replace: true});
    }
}


const handleInputChange = (event, setFormData) => {
    const { name, value } = event.target;

    if (event.target.type === 'file') {
        const file = event.target.files.length ? event.target.files[0] : null;
        return setFormData(data => ({...data, [name]: file}));
    }

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
    getNewGuest,
    postData,
    putData,
    deleteData,
    handleInputChange,
    handleSubmitForm
}