import { useState } from 'react'
import { Navigation } from './components/Navigation';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useFetchData } from './helpers';
import Loader from './components/Loader';
import ServerErrorPage from './pages/ServerErrorPage';
import './App.css'


const App = () => {
  const token = localStorage.getItem('token');
  const currentUserHandle = localStorage.getItem('currentUserHandle');

  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUserHandle?.slice(1)}/profile`;
  const expectedKey = 'profile';
  useFetchData(token, currentUserHandle, setCurrentUser, setCurrentUser, setError, setLoading, navigate, url, expectedKey, location);


  if (loading) return (<Loader />);

  if (error) return (<ServerErrorPage />);

  if (token && currentUser) return (
    <>
      <Navigation currentUser={currentUser} setCurrentUser={setCurrentUser} token={token} setError={setError} setLoading={setLoading}/>
      <Outlet context={[currentUser, setCurrentUser, token]}/>
    </>
  );

  return (
    <Outlet context={[currentUser, setCurrentUser, token]}/>
  );
}

export default App
