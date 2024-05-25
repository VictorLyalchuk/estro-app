import { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import '../../../../../index.css';
import { APP_ENV } from "../../../../../env/config";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button, FormControl, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        margin: {
            margin: theme.spacing(0),
        },
        input: {
        },
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
    }),
);

const ResetPassword: React.FC<{ email: string; token: string; }> = (proprs) => {
    const baseUrl = APP_ENV.BASE_URL;
    const classes = useStyles();
    const [isResetPassword, setResetPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: proprs.email || '',
        token: proprs.token || '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors: {
            confirmPassword: string;
            newPassword: string;
        } = {
            confirmPassword: "",
            newPassword: "",
        };

        if (formData.confirmPassword !== formData.newPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (formData.newPassword.trim() === '') {
            newErrors.newPassword = 'Password is required';
            isValid = false;
        } else if (formData.newPassword.length < 7) {
            newErrors.newPassword = 'Password must be at least 7 characters long';
            isValid = false;
        } else if (!/[a-zA-Z]/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain at least one letter';
            isValid = false;
        } else if (!/[^a-zA-Z0-9]/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain at least one symbol';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateForm()) {

            try {
                await axios.post(`${baseUrl}/api/AccountControllers/ResetPassword`,  formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setResetPassword(true);
            } catch (error) {
                console.error("Reset password error:", error);
                setErrorMessage("Reset password error. Try again later");
                setTimeout(() => {
                    setErrorMessage("");
                }, 1000);
            }
        } else {
            console.log(formData);
        }
    };

    const handlePasswordToggle = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleConfirmPasswordToggle = () => {
        setConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
    };

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto">
                    <div className="bg-white rounded-md shadow-md p-5 flex flex-col lg:flex-row">

                        <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0 flex flex-col justify-center items-center">
                            {isResetPassword ? (
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Restored Successfully</h2>
                                    <br />
                                    <p className="text-gray-500">You have successfully restored your password. Please proceed to login.</p>
                                </div>
                            ) : (

                                <div className="mb-24 ">
                                    <div className="sm:mx-auto sm:w-full sm:max-w-sm" >
                                        <h2 className="mt-5 mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                            Reset Password
                                        </h2>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <FormControl fullWidth className={classes.margin} variant="outlined">
                                            <TextField
                                                label="New Password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                error={!!errors.newPassword}
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
                                            {errors.newPassword ? (
                                                <div className="h-6 text-xs text-red-500">Error: {errors.newPassword}</div>
                                            ) : (<div className="h-6 text-xs "> </div>)}
                                        </FormControl >

                                        <FormControl fullWidth className={classes.margin} variant="outlined">
                                            <TextField
                                                label="Confirm New Password "
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                error={!!errors.confirmPassword}
                                                helperText={errors.confirmPassword}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={handleConfirmPasswordToggle} edge="end">
                                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            {errors.confirmPassword ? (
                                                <div className="h-6 text-xs text-red-500">Error: {errors.confirmPassword}</div>
                                            ) : (<div className="h-12 text-xs "> </div>)}
                                        </FormControl>

                                        <FormControl fullWidth className={classes.margin} variant="outlined">
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

export default ResetPassword;
