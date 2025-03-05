import { useState, useEffect } from 'react'
import { Navigation } from './components/Navigation';
import { Outlet, useNavigate } from 'react-router';
import './App.css'


// Use outlet context for currentUser info (id, profile pic, name, username, etc)
// Render Navigation component within App since Navigation has no route of its own
// also use state for location change-- whenever location changes then Navigation will rerender with new notifs
const useFetchUserInfo = (token, currentUserID, setCurrentUser, setError, setLoading, navigate) => {

  fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${currentUserID}`, {
      method: 'get',
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
    if (res.error || !res.authenticated) {
      setCurrentUser(null);
      localStorage.clear();
      return navigate("/login");
    }

    if (res.userInfo) {
      setCurrentUser(res.userInfo);
    }
  })
  .catch(err => {
    setError(err);
  })
  .finally(() => {
    setLoading(false);
  })
}



const App = () => {
  const token = localStorage.getItem('token');
  const currentUserID = localStorage.getItem('current_user_id');

  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (token && currentUserID) {
      useFetchUserInfo(token, currentUserID, setCurrentUser, setError, setLoading, navigate);
    } else {
      setLoading(false);
      navigate("/login");
    }
  }, []);

  if (loading) return (<div className="h-screen w-screen flex items-center justify-center"><div className="loader mx-auto"></div></div>)

  if (error) return (<p className="h-screen w-screen text-center">A network error was encountered.</p>);

  if (token && currentUser) return (
    <>
      <Navigation currentUser={currentUser} setCurrentUser={setCurrentUser} token={token}/>
      <Outlet context={[currentUser, setCurrentUser, token]}/>
    </>
  );

  return (
    <Outlet context={[currentUser, setCurrentUser, token]}/>
  );
}

export default App
