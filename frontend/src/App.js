import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import SignUp from './Components/SignUp/SignUp';
import SignIn from './Components/SignIn/SignIn';
import Otp from './Components/OTP/Otp';
import UserProvider from './UserContext';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';

function App() {
  const routes = createRoutesFromElements(
    <Route path='/' element={< Navbar />} >
      <Route index element={<Home />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='signin' element={<SignIn />} >
        <Route path='otpSignIn' element={<Otp />} />
      </Route>
      <Route path='forgot-password' element={<ForgotPassword />} />
    </Route>
  );

  const router = createBrowserRouter(routes);

  return (

    <UserProvider >
      <RouterProvider router={router} />
    </UserProvider>

  );
}

export default App;
