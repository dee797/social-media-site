import { useState } from 'react'
import { Navigation } from './components/Navigation';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useFetchData } from './helpers';
import Loader from './components/Loader';
import ServerErrorPage from './components/ServerErrorPage';
import './App.css'


const App = () => {
  const token = localStorage.getItem('token');
  const currentUserID = localStorage.getItem('current_user_id');

  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUserID}`;
  const expectedKey = 'userInfo';
  useFetchData(token, currentUserID, setCurrentUser, setCurrentUser, setError, setLoading, navigate, url, expectedKey, location);


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
