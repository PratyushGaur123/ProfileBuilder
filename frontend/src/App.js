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
import NotificationDropdown from './Components/Utils/Spinner';
import Chat from './Components/Chat/Chat';
import PostDetails from './Components/PostDetails/PostDetails';
import Post from './Components/Post/Post';
import PostProvider from './Contexts/PostContext';


function App() {
  const routes = createRoutesFromElements(
    <Route path='/' element={< Navbar />} >
      <Route element={<Home />} >
        <Route index element={<Post />} />
        <Route path='post/:postId' element={<PostDetails />} />
      </Route>
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
          <PostProvider>
            <RouterProvider router={router} />
          </PostProvider>
        </SocketProvider>
      </UserProvider >
    </>
  );
}

export default App;
