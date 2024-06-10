import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from 'react';
import 'tailwindcss/tailwind.css';
import '../../../../../index.css';
import { APP_ENV } from "../../../../../env/config";
import {Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { GiftIcon } from '@heroicons/react/24/outline';
import { ILogin } from '../../../../../interfaces/Auth/ILogin';
import { IUser } from '../../../../../interfaces/Auth/IUser';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { AuthReducerActionType } from '../../../../../store/accounts/AuthReducer';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { TrophyIcon } from '@heroicons/react/24/outline';
import {Divider} from "antd";
import {useGoogleLogin} from '@react-oauth/google';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '../../../../../satoshi.css';
import MaskedInput from "react-text-mask";
import ReactCodeInput from "react-code-input";

interface TextMaskCustomProps {
    inputRef: (ref: HTMLInputElement | null) => void;
}

function TextMaskCustom(props: TextMaskCustomProps) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref: any) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
        />
    );
}

interface State {
    textmask: string;
}
const theme = createTheme({
    typography: {
        fontFamily: 'Satoshi, sans-serif',
    },
    overrides: {
        MuiTextField: {
            root: {
                fontFamily: 'Satoshi, sans-serif',
            },
        },
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(0),
    },
    input: {},
    button: {
        textTransform: 'none',
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        '& .MuiInputBase-root': {
            height: '60px',
        },
    },
    googleButton: {
        textTransform: 'none',
        backgroundColor: '#4285F4',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#357ae8',
        },
        margin: theme.spacing(1, 0),
    },
}));

const LoginPage = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const twilio_auth_token = APP_ENV.TWILIO_AUTH_TOKEN;
    const twilio_acc_sid = APP_ENV.TWILIO_ACC_SID;
    const twilio_service_sid = APP_ENV.TWILIO_SERVICE_SID;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const classes = useStyles();
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isPhoneLogin, setIsPhoneLogin] = useState(false);
    const [isPhoneExists, setIsPhoneExists] = useState(false);
    const [verifySid, setVerifySid] = useState("");
    const [myToken, setMyToken] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        let timer;
        if (isDisabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsDisabled(false);
        }
        return () => clearInterval(timer);
    }, [isDisabled, countdown]);






    const [values, setValues] = useState<State>({
        textmask: '(   )    -  -  ',
    });

    const [formData, setFormData] = useState<ILogin>({
        email: '',
        password: '',
        phoneNumber: '',
        authType: 'standard'
    });


    const [errors, setErrors] = useState({
        email: '',
        password: '',
        phoneNumber: '',
        authType: 'standard'
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmitEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(formData);

            try {
                const response = await axios.post(`${baseUrl}/api/AccountControllers/Login`, formData);
                const { token } = response.data;
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

    };
    const handleSubmitPhone = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
            try {
                const response = await axios.post(`${baseUrl}/api/AccountControllers/LoginByPhone?phone=${formData.phoneNumber}`, {});

                if (response.status === 200) {
                    setIsPhoneExists(true);
                    console.log(response.data);
                    setVerifySid(response.data.token.sid);
                    setMyToken(response.data.token.token);
                }

            } catch (error) {
                console.error("Login error:", error);
                setErrorMessage("Invalid email or password");
                setTimeout(() => {
                    setErrorMessage("");
                }, 1000);
            }
    }

    const handleCodeConfirm = async () => {


        try {
            const response = await axios.post(
                `https://verify.twilio.com/v2/Services/${twilio_service_sid}/VerificationCheck`,
                new URLSearchParams({
                    Code: pinCode,
                    VerificationSid: verifySid
                }),
                {
                    auth: {
                        username: twilio_acc_sid,
                        password: twilio_auth_token
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.status === 200 && response.data.status === "approved") {
                console.log(response.data);
                const token = myToken;
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

                console.log("approved");
                setIsPhoneLogin(false); setIsPhoneExists(false);
            } else {
                setPinCode("");
                setIsDisabled(true);
                setTimeout(() => {
                    setIsDisabled(false);
                }, 30000); // 30 seconds

                setIsPhoneExists(false);
                throw new Error("Verification failed");
            }

        } catch (error) {
            setPinCode("");
            setIsDisabled(true);
            setTimeout(() => {
                setIsDisabled(false);
            }, 30000); // 30 seconds

            setIsPhoneExists(false);
            console.error("Verification error:", error);
            setErrorMessage("Invalid code or verification failed");
            setTimeout(() => {
                setErrorMessage("");
            }, 1000);
        }

    };

    const googleSuccess = async (response) => {
        console.log(response);

        if (response) {
            try {
                const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${response.access_token}`,
                        Accept: 'application/json',
                    },
                });
                const userData = res.data;
                console.log(userData);

                const loginData = {
                    email: userData.email,
                    authType: 'google',
                };

                console.log(loginData);

                try {
                    const response = await axios.post(`${baseUrl}/api/AccountControllers/Login`, loginData);
                    const { token } = response.data;
                    const user = jwtDecode(token) as IUser;

                    dispatch({
                        type: AuthReducerActionType.LOGIN_USER,
                        payload: {
                            Email: user.Email,
                            FirstName: user.FirstName,
                            LastName: user.LastName,
                            Role: user.Role,
                            ImagePath: user.ImagePath,
                            AuthType: user.AuthType,
                        } as IUser,
                    });

                    localStorage.setItem('token', token);
                    navigate('/');
                } catch (error) {
                    console.error('Login error:', error);
                    setErrorMessage('Invalid email or password');
                    setTimeout(() => {
                        setErrorMessage('');
                    }, 1000);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };



    const googleErrorMessage = (error) => {
        console.log(error);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors: {
            email: string;
            password: string;
            phoneNumber: string;
        } = {
            email: "",
            password: "",
            phoneNumber: "",
        };

        if (formData.email.trim() === '' || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }
        const cleanedPhoneNumber = values.textmask.replace(/\D/g, '');
        if (cleanedPhoneNumber.trim() === '') {
            newErrors.phoneNumber = 'Phone Number is required';
            isValid = false;
        }
        else if (!/^(067|095|099|066|063|098|097|096|093)\d{7}$/.test(cleanedPhoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number format';
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
    const loginGoogle = useGoogleLogin({
        onSuccess: googleSuccess,
        onError: googleErrorMessage
    });

    function togglePhone() {
        setIsPhoneLogin(true);
    }

    function toggleEmail() {
        setIsPhoneLogin(false);

    }
    const validatePhoneNumber = (value: string) => {
        const isValidPrefix = /^(067|095|099|066|063|098|097|096|093)/.test(value.substr(0, 3));

        const isValidDigits = /^\d{7}$/.test(value.substr(3));

        const isValid = isValidPrefix && isValidDigits;

        setErrors((prevErrors) => ({
            ...prevErrors,
            phoneNumber: isValid ? '' : 'Invalid phone number format',
        }));
    };

    const handleChangePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

        const cleanedValue = value.replace(/\D/g, '');
        setFormData((prevData) => ({
            ...prevData,
            phoneNumber: cleanedValue,
        }));

        validatePhoneNumber(cleanedValue);
    };
    const [pinCode, setPinCode] = useState("");
    const [btnIsPressed, setBtnIsPressed] = useState(false);

    const handlePinChange = pinCode => {
        setPinCode(pinCode);
        setBtnIsPressed(false);
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

                                {!isPhoneLogin ? (
                                    <form onSubmit={handleSubmitEmail}>
                                        <ThemeProvider theme={theme}>

                                            <FormControl fullWidth className={classes.margin} variant="outlined">
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

                                            <FormControl fullWidth className={classes.margin} variant="outlined">
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

                                        <FormControl fullWidth className={classes.margin} variant="outlined">
                                            <Button className={classes.button} type="submit" variant="contained" size="large" color="primary" disableElevation>
                                                Sign in
                                            </Button>
                                        </FormControl>

                                    </form>
                                ) : (
                                    <form onSubmit={handleSubmitPhone}>
                                        <ThemeProvider theme={theme}>


                                            <FormControl fullWidth className={classes.margin} variant={"outlined"}>
                                                <InputLabel >Phone Number</InputLabel>

                                                <Input
                                                    name="textmask"
                                                    value={values.textmask}
                                                    onChange={handleChangePhoneNumber}
                                                    id="formatted-text-mask-input"
                                                    inputComponent={TextMaskCustom as any}
                                                    error={!!errors.phoneNumber}
                                                    placeholder='(099) 00-00-000'
                                                />
                                                {errors.phoneNumber ? (
                                                    <div className="h-6 text-xs text-red-500">Error: {errors.phoneNumber}</div>
                                                ) : (<div className="h-6 text-xs "> </div>)}
                                            </FormControl>



                                        </ThemeProvider>
                                        <FormControl fullWidth className={classes.margin} variant="outlined">

                                        {isPhoneExists ? (
                                                <div className={"justify-center text-center flex-col"}>
                                                    <div className={"mb-3"}>
                                                        <ReactCodeInput
                                                            inputMode={"numeric"}
                                                            id="pinCode"
                                                            fields={6}
                                                            onChange={handlePinChange}
                                                            value={pinCode}
                                                        />

                                                    </div>

                                                </div>



                                        ) : null}

                                            {!isPhoneExists ? (
                                                <Button className={classes.button}  disabled={isDisabled} type="submit" variant="contained" size="large" color="primary" disableElevation>
                                                    {isDisabled ? `Send code (${countdown}s)` : 'Send code'}
                                                </Button>
                                            ) : (
                                                <Button className={classes.button} onClick={handleCodeConfirm} type="button" variant="contained" size="large" color="primary" disableElevation>
                                                    Sign in
                                                </Button>
                                            )}

                                        </FormControl>

                                    </form>
                                )}

                                <Divider>or</Divider>
                                <div className={"flex justify-center"}>

                                    <Button className={"bg-gray-400"} onClick={() => loginGoogle()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                                            <path fill="currentColor" d="M881 442.4H519.7v148.5h206.4c-8.9 48-35.9 88.6-76.6 115.8c-34.4 23-78.3 36.6-129.9 36.6c-99.9 0-184.4-67.5-214.6-158.2c-7.6-23-12-47.6-12-72.9s4.4-49.9 12-72.9c30.3-90.6 114.8-158.1 214.7-158.1c56.3 0 106.8 19.4 146.6 57.4l110-110.1c-66.5-62-153.2-100-256.6-100c-149.9 0-279.6 86-342.7 211.4c-26 51.8-40.8 110.4-40.8 172.4S151 632.8 177 684.6C240.1 810 369.8 896 519.7 896c103.6 0 190.4-34.4 253.8-93c72.5-66.8 114.4-165.2 114.4-282.1c0-27.2-2.4-53.3-6.9-78.5"/>
                                        </svg>
                                    </Button>

                                </div>
                                <div className={"flex justify-center mt-5"}>
                                    {!isPhoneLogin ?
                                        (
                                            <p onClick={togglePhone} className="cursor-pointer hover:scale-110 transition-transform duration-300">Use phone</p>
                                    ) :
                                        (
                                            <p onClick={toggleEmail} className="cursor-pointer hover:scale-110 transition-transform duration-300">Use email</p>
                                        )}
                                </div>
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