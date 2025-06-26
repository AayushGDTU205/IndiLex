import { useEffect } from 'react';
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
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.userReducer);
  if(userData && userData.isLoggedIn && userData.isAdmin){
      navigate('/adminDashboard');
    }
    else if(userData && userData.isLoggedIn && userData.isLawyer){
      navigate('/lawyerDashboard');
    }
    else if (userData && userData.isLoggedIn) {
      navigate('/dashboard');
    }
  useEffect(()=>{
    if(userData && userData.isLoggedIn && userData.isAdmin){
      navigate('/adminDashboard');
    }
    else if(userData && userData.isLoggedIn && userData.isLawyer){
      navigate('/lawyerDashboard');
    }
    else if (userData && userData.isLoggedIn) {
      navigate('/dashboard');
    }
    const gettingMe=async()=>{
      try{
        const response=await instance.get('/me');
        if(response.status===200){
          dispatch({ type: 'SET_USER', payload: response.data.data });
        }
        else{
          navigate('/');
        }
      }
      catch(error:any){
        if(error.message==='server failure' || error.response.status>399){
          navigate('/');
        }
      }
    }
    gettingMe();
  },[]);
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