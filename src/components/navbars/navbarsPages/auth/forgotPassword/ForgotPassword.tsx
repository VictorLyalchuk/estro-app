import { useState } from 'react';
import axios from 'axios';
import { APP_ENV } from "../../../../../env/config";
import { Button, FormControl, TextField } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '../../../../../satoshi.css';
import '../../../../../index.css';
import 'tailwindcss/tailwind.css';

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
const ForgotPassword = ({ onPasswordResetConfirmation }: { onPasswordResetConfirmation: () => void }) => {
    const baseUrl = APP_ENV.BASE_URL;
    const classes = useStyles();
    const [isSendEmail, setSendEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: '',
    });

    const [errors, setErrors] = useState({
        email: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                await axios.post(`${baseUrl}/api/AccountControllers/ForgotPassword`, formData.email, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                setSendEmail(true);
                onPasswordResetConfirmation();
            }
            catch (error) {
                console.error("Email error:", error);
                setErrorMessage("Invalid email");
                setTimeout(() => {
                    setErrorMessage("");
                }, 1000);
            }
        } else {
            console.log(formData);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors: {
            email: string;
        } = {
            email: "",
        };

        if (formData.email.trim() === '' || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto">
                    <div className="bg-white rounded-md shadow-md p-5 flex flex-col lg:flex-row">

                        <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0 flex flex-col justify-center items-center">
                            {isSendEmail ? (
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Email Was Successfully Received</h2>
                                    <br />
                                    <p className="text-gray-500">
                                        Check your email and continue the password recovery process.</p>
                                </div>
                            ) : (
                                <div className="mb-24 ">
                                    <div className="sm:mx-auto sm:w-full sm:max-w-sm" >
                                        <h2 className="mt-5 mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                            Forgot Password
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
                                        </ThemeProvider>

                                            <FormControl fullWidth variant="outlined">
                                                <Button className={classes.button} type="submit" variant="contained" size="large" color="primary" disableElevation>
                                                    Reset Password
                                                </Button>
                                            </FormControl>

                                    </form>

                                </div >
                            )}
                        </div >

                        <div className="w-full lg:w-2/4 p-5 lg:mb-0">

                            <div className="bg-white-container-login flex flex-col justify-center items-center h-full">
                                <h1 className="text-white text-7xl hover:text-indigo-300">estro</h1>
                                <p className="text-white text-sx mb-10 hover:text-indigo-300">SHOES & ACCESSORIES</p>

                                <br />

                                <p className="text-center text-sx hover:text-indigo-300">
                                    Forgot your password?
                                </p>
                                <br />

                                <p className="text-center text-sx hover:text-indigo-300">
                                    Please follow the instructions below to restore it
                                </p>

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
};

export default ForgotPassword;