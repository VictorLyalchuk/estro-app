import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import 'tailwindcss/tailwind.css';
import '../../../../../index.css';
import { APP_ENV } from "../../../../../env/config";
import { Button, FormControl, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { GiftIcon } from '@heroicons/react/24/outline';
import { ILogin } from '../../../../../interfaces/Auth/ILogin';
import { IUser } from '../../../../../interfaces/Auth/IUser';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { AuthReducerActionType } from '../../../../../store/accounts/AuthReducer';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { TrophyIcon } from '@heroicons/react/24/outline';
// import {Divider} from "antd";
// import { GoogleLogin } from '@react-oauth/google';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '../../../../../satoshi.css';

const theme = createTheme({
    typography: {
        fontFamily: 'Satoshi, sans-serif',
    },
});

const useStyles = makeStyles(() =>
    createStyles({
        button: {
            textTransform: 'none',
        },
    }),
);

const LoginPage = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const classes = useStyles();
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<ILogin>({
        email: '',
        password: '',
        authType: 'standard'
    });


    const [errors, setErrors] = useState({
        email: '',
        password: '',
        authType: 'standard'
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post(`${baseUrl}/api/AccountControllers/Login`, formData);
                const { token } = response.data;
                console.log(response.data)
                const user = jwtDecode(token) as IUser;
                dispatch({
                    type: AuthReducerActionType.LOGIN_USER,
                    payload: {
                        Email: user.Email,
                        FirstName: user.FirstName,
                        LastName: user.LastName,
                        Role: user.Role,
                        ImagePath: user.ImagePath,
                        PhoneNumber: user.PhoneNumber,
                        AuthType: user.AuthType
                    } as IUser,
                });
                
                localStorage.setItem("token", token);
                navigate("/");
            } catch (error) {
                console.error("Login error:", error);
                setErrorMessage("Invalid email or password");
                setTimeout(() => {
                    setErrorMessage("");
                }, 1000);
            }
        } else {
            console.log(formData);
        }
    };

    // const googleSuccess = async (response) => {
    //     const token = response.credential;
    //     const user = jwtDecode(token);
    //     const loginData = {
    //         email: user?.email,
    //         authType: 'google',
    //     };

    //   try {
    //         const response = await axios.post(`${baseUrl}/api/AccountControllers/Login`, loginData);
    //         const { token } = response.data;
    //         const user = jwtDecode(token) as IUser;

    //         dispatch({
    //             type: AuthReducerActionType.LOGIN_USER,
    //             payload: {
    //                 Email: user.Email,
    //                 FirstName: user.FirstName,
    //                 LastName: user.LastName,
    //                 Role: user.Role,
    //                 ImagePath: user.ImagePath,
    //                 AuthType: user.AuthType
    //             } as IUser,
    //         });

    //         localStorage.setItem("token", token);
    //         navigate("/");
    //     } catch (error) {
    //         console.error("Login error:", error);
    //         setErrorMessage("Invalid email or password");
    //         setTimeout(() => {
    //             setErrorMessage("");
    //         }, 1000);
    //     }
    // }
    // const googleErrorMessage = (error) => {
    //     console.log(error);
    // };

    const validateForm = () => {
        let isValid = true;
        const newErrors: {
            email: string;
            password: string;
            authType: string;

        } = {
            email: "",
            password: "",
            authType: "",
        };

        if (formData.email.trim() === '' || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }

        if (formData.password.trim() === '') {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handlePasswordToggle = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto">
                    <div className="bg-white rounded-md shadow-md p-5 flex flex-col lg:flex-row">

                        <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0 flex flex-col justify-center items-center">
                            <div className="mb-24 ">
                                <div className="sm:mx-auto sm:w-full sm:max-w-sm" >
                                    <h2 className="mt-5 mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                        Login
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <ThemeProvider theme={theme}>
                                        <FormControl fullWidth variant="outlined">
                                            <TextField
                                                label="Email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                error={!!errors.email}
                                            />
                                            {errors.email ? (
                                                <div className="h-6 text-xs text-red-500">Error: {errors.email}</div>
                                            ) : (<div className="h-6 text-xs "> </div>)}
                                        </FormControl>

                                        <FormControl fullWidth variant="outlined">
                                            <TextField
                                                label="Password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                error={!!errors.password}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={handlePasswordToggle} edge="end">
                                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            {errors.password ? (
                                                <div className="h-6 text-xs text-red-500">Error: {errors.password}</div>
                                            ) : (<div className="h-6 text-xs "> </div>)}
                                        </FormControl >
                                        </ThemeProvider>

                                    <FormControl fullWidth variant="outlined">
                                        <Button className={classes.button} type="submit" variant="contained" size="large" color="primary" disableElevation>
                                            Sign in
                                        </Button>
                                    </FormControl>

                                </form>
                                {/* <Divider>or</Divider>
                                <div className={"flex justify-center"}>
                                    <GoogleLogin  onSuccess={googleSuccess} onError={googleErrorMessage} />
                                </div> */}

                            </div >
                        </div >

                        <div className="w-full lg:w-2/4 p-5 lg:mb-0">

                            <div className="bg-white-container-login flex flex-col justify-center items-center h-full">
                                <h1 className="text-white text-7xl hover:text-indigo-300">estro</h1>
                                <p className="text-white text-sx mb-10 hover:text-indigo-300">SHOES & ACCESSORIES</p>

                                <br />

                                <p className="text-center text-sx hover:text-indigo-300">
                                    Welcome back
                                </p>
                                <br />

                                <p className="text-center text-sx hover:text-indigo-300">
                                    Check your account, you have a discount
                                </p>
                                <br />
                                <ul className="list-disc text-sx text-left">
                                    <li className="mb-5 mt-2 flex justify-center items-center gap-x-3 relative hover:text-indigo-300">
                                        <BanknotesIcon className="h-7 w-7 text-gray-300" />
                                        <p className="text-center">
                                            Rewards
                                        </p>
                                    </li>
                                    <li className="mb-5 mt-2 flex justify-center items-center gap-x-3 relative hover:text-indigo-300">
                                        <GiftIcon className="h-7 w-7 text-gray-300" />
                                        <p className="text-center">
                                            Surprises!
                                        </p>
                                    </li>
                                    <li className="mb-5 mt-2 flex justify-center items-center gap-x-3 relative hover:text-indigo-300" >
                                        <TrophyIcon className="h-7 w-7 text-gray-300" />
                                        <p className="text-center">
                                            Personal promotions!
                                        </p>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div >

                    <div className={`fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 ${errorMessage ? 'block' : 'hidden'}`}>
                        <div className="bg-white p-4 rounded-md shadow-md">
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        </div>
                    </div>

                </div >
            </div >
        </>
    );
}
export default LoginPage;