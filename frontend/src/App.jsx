import Navbar from "./components/Navbar"
import {Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import {useAuthStore} from "./store/useAuthStore.js"
import NotFound from "./pages/404.jsx";
import { useEffect } from "react";
import Loader from "./components/Loader.jsx";
import { Navigate } from "react-router-dom";

function App() {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore(); // useAuthStore() here is a hook -> from which we are extracting authUser state and checkAuth function

  useEffect(()=>{
     checkAuth();
  }, [checkAuth])

  console.log(authUser);

  // if we are checking if the user is authenticated or not and get null in authUser -> which means the user is not authenticated -> show a loader:



  if(isCheckingAuth && !authUser){
    return <Loader/>
  }


  return (
    <>
    <div>
      <Navbar/>
      <Routes>
        {/* if the user is authenticated -> navigate to the following components else don't */}
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/signup" element={!authUser ?<SignUpPage/> : <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ?<LoginPage/> : <Navigate to="/"  />}/>
        <Route path="/*" element={<NotFound/>} />
        <Route path="/profile" element={authUser? <ProfilePage/> : <Navigate to="/login"/>}/>
      </Routes>

      </div>
    </>
  )
}

export default App
