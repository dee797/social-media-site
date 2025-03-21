import { useState, useEffect } from 'react'
import { Navigation } from './components/Navigation';
import { Outlet, useNavigate } from 'react-router';
import Loader from './components/Loader';
import ServerErrorPage from './pages/ServerErrorPage';
import './App.css'


const App = () => {
  const token = localStorage.getItem('token');
  const currentUserHandle = localStorage.getItem('currentUserHandle');

  const [currentUser, setCurrentUser] = useState(null);
  const [shouldUpdateUser, setShouldUpdateUser] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUserHandle?.slice(1)}/profile`;

  useEffect(() => {
    let goTo = "";
    if (window.location.pathname === "/signup" || window.location.pathname === "/login") {
        goTo = window.location.pathname;
    } else {
        goTo = "/signup";
    }

    if (token && currentUserHandle) {
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
                navigate("/login", {replace: true});
                localStorage.clear();
                setCurrentUser(null);
                return;
            }

            setCurrentUser(res);
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
        navigate(goTo, {replace: true});
    }
  }, [shouldUpdateUser]);



  if (loading) return (<Loader />);

  if (error) return (<ServerErrorPage />);

  if (token && currentUser) return (
    <>
      <Navigation currentUser={currentUser} setCurrentUser={setCurrentUser} token={token} setError={setError} setLoading={setLoading}/>
      <Outlet context={[currentUser, setCurrentUser, token, setShouldUpdateUser]}/>
    </>
  );

  return (
    <Outlet context={[currentUser, setCurrentUser, token]}/>
  );
}

export default App
