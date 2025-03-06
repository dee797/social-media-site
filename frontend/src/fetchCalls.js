const checkUser = async (token, setCurrentUser, setServerError, setLoading, navigate) => {

    return fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
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
}


const fetchData = async (token, setCurrentUser, setData, setError, setLoading, navigate, url, expectedKey=null) => {

    return fetch(url, {
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
}


export {
    checkUser,
    fetchData
}