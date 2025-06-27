import { useEffect, useState } from 'react';
import {Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login'; 
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import LawyerDashboard from './components/LawyerDashboard';
import { useDispatch } from 'react-redux';
import instance from './utils/Axios';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store/store';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.userReducer);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Helper function to handle navigation based on user type
  const navigateBasedOnUser = (user: any) => {
    if (user && user.isLoggedIn) {
      if (user.isAdmin) {
        navigate('/adminDashboard');
      } else if (user.isLawyer) {
        navigate('/lawyerDashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  // Initial authentication check
  useEffect(() => {
    const gettingMe = async () => {
      try {
        const response = await instance.get('/me');
        if (response.status === 200) {
          dispatch({ type: 'SET_USER', payload: response.data.data });
          navigateBasedOnUser(response.data.data);
        } else {
          navigate('/');
        }
      } catch (error: any) {
        if (error.message === 'server failure' || error.response?.status > 399) {
          navigate('/');
        }
      } finally {
        setIsInitialLoad(false);
      }
    };

    if (isInitialLoad) {
      gettingMe();
    }
  }, [isInitialLoad]);

  // Handle navigation when userData changes (after login/logout)
  useEffect(() => {
    if (!isInitialLoad && userData) {
      navigateBasedOnUser(userData);
    }
  }, [userData, isInitialLoad]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/adminDashboard" element={<AdminDashboard/>}/>
        <Route path="/lawyerDashboard" element={<LawyerDashboard/>}/>
      </Routes>
    </div>
  );
}

export default App;