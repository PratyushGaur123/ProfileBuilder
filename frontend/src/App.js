import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import SignUp from './Components/SignUp/SignUp';
import SignIn from './Components/SignIn/SignIn';
import Otp from './Components/OTP/Otp';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import Inbox from './Components/Inbox/Inbox';
import UserProvider from './Contexts/UserContext';
import { SocketProvider } from './Contexts/SocketContext';
import Chat from './Components/Chat/Chat';


function App() {
  const routes = createRoutesFromElements(
    <Route path='/' element={< Navbar />} >
      <Route index element={<Home />} />
      <Route path='inbox' element={<Inbox />} >
        <Route path='chat/:conversationId' element={<Chat />} />
      </Route>
      <Route path='signup' element={<SignUp />} />
      <Route path='signin' element={<SignIn />} >
        <Route path='otpSignIn' element={<Otp />} />
      </Route>
      <Route path='forgot-password' element={<ForgotPassword />} />
    </Route>
  );

  const router = createBrowserRouter(routes);

  return (
    <>
      <UserProvider >
        <SocketProvider >
          <RouterProvider router={router} />
        </SocketProvider>
      </UserProvider >
    </>
  );
}

export default App;
