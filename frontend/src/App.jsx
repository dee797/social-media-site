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
  const [shouldUpdateUser, setShouldUpdateUser] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUserHandle?.slice(1)}/profile`;

  useFetchData(token, currentUserHandle, setCurrentUser, setCurrentUser, setError, setLoading, navigate, url, null, [shouldUpdateUser, token]);


  if (loading) return (<Loader />);

  if (error) return (<ServerErrorPage />);

  if (token && currentUser) return (
    <>
      <Navigation currentUser={currentUser} setCurrentUser={setCurrentUser} token={token} setError={setError} setLoading={setLoading}/>
      <Outlet context={[currentUser, setCurrentUser, token, setShouldUpdateUser, shouldUpdateUser]} key={location.pathname}/>
    </>
  );

  return (
    <Outlet context={[currentUser, setCurrentUser, token]} key={location}/>
  );
}

export default App
