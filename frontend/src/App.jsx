import { useState, useEffect } from 'react'
import { Navigation } from './components/Navigation';
import { Outlet, useNavigate } from 'react-router';
import Loader from './components/Loader';
import ServerErrorPage from './components/ServerErrorPage';
import './App.css'


const fetchUserInfo = async (token, currentUserID, setCurrentUser, setError, setLoading, navigate) => {

  return fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${currentUserID}`, {
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
    if (res.error || res.authenticated === false) {
      localStorage.clear();
      setCurrentUser(null);
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
      fetchUserInfo(token, currentUserID, setCurrentUser, setError, setLoading, navigate);
    } else {
      setLoading(false);
      navigate("/login");
    }
  }, []);

  if (loading) return (<Loader />);

  if (error) return (<ServerErrorPage />);

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
