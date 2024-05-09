import { createContext, useContext, useState } from "react";
import axios from "axios";


const userContext = createContext();

export const useUserContext = () => {
    const value = useContext(userContext);
    return value;
}

function UserProvider({ children, navigate }) {
    // const [user, setUser] = useState(null);
    // const [navigation, setNavigation] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [user, setUser] = useState(null);
;

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !password || !confirmPassword || !gender || !dateOfBirth) {
            alert("Please fill all the fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Password and Confirm Password doesn't match");
            return;
        }

        if(password.length < 8 || password.length > 20 || confirmPassword.length < 8 || confirmPassword.length > 20) {
            alert("Password must be between 8 and 20 characters");
            return;
        }

        if( firstName.length < 2 || firstName.length > 20 || lastName.length < 2 || lastName.length > 20) {
            alert("First name and last name must be between 2 and 20 characters");
            return;
        }

        if (email.length < 5 || email.length > 20) {
            alert("Email must be between 5 and 20 characters");
            return;
          }

        try {
            console.log('the date of birth is: ', dateOfBirth);
            const response = await axios.post("http://localhost:8000/users/sign-up",
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    confirmPassword,
                    gender,
                    dateOfBirth
                });

            if (response.status === 200) {
                alert("User created successfully");
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setGender('');
                setDateOfBirth('');
                return;
            }
        } catch (error) {
            console.log('Error in creating the user');
            if (error.response) {
                alert(error.response.data.message);
            }
            else if (error.request) {
                alert("Network error. Please check your internet connection.");
            }
            else {
                // console.error("Error:", error.message);
                alert("An unexpected error occurred during signup. Please try again later.");
            }
        }
    }

    const handleSignInPassword = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please fill all the fields");
            return;
        }
        try {
            const response = await axios.post("http://localhost:8000/users/sign-in-password",
                {
                    email,
                    password
                });
            if (response.status === 200) {
                setEmail('');
                setPassword('');
                setFirstName('');
                setLastName('');
                setGender('');
                setDateOfBirth('');
                setUser(response.data.data.user);
                const token = response.data.data.token;
                localStorage.setItem("token", token);
                return;
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message);
                // TODO: handle specific status codes 
                setPassword('');
            }
            else {
                alert("Network error. Please check your internet connection.");
            }
        }
    }







    return (
        <userContext.Provider value={{ firstName, setFirstName, lastName, setLastName, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, gender, setGender, dateOfBirth, setDateOfBirth, handleSignUp, user, setUser, handleSignInPassword }}>
            {children}
        </userContext.Provider>
    )
}

export default UserProvider;