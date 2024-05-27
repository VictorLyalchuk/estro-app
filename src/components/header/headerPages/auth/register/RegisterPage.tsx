import axios from 'axios';
import { ChangeEvent, useState } from 'react';
import { IRegister } from '../../../../../interfaces/Auth/IRegister';
import 'tailwindcss/tailwind.css';
import '../../../../../index.css';
import { APP_ENV } from "../../../../../env/config";
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import MaskedInput from 'react-text-mask';
import { GiftIcon } from '@heroicons/react/24/outline';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '../../../../../satoshi.css';

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

const RegisterPage = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const classes = useStyles();
    const [isRegistered, setIsRegistered] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [values, setValues] = useState<State>({
        textmask: '(   )    -  -  ',
    });

    const [formData, setFormData] = useState<IRegister>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        imageFile: null,
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                await axios.post(`${baseUrl}/api/AccountControllers/Registration`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setIsRegistered(true);
            } catch (error) {
                console.error("Register error:", error);
                setErrorMessage("Register error. Try again later");
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
            firstName: string;
            lastName: string;
            confirmPassword: string;
            phoneNumber: string;
            email: string;
            password: string;
        } = {
            firstName: "",
            lastName: "",
            confirmPassword: "",
            phoneNumber: "",
            email: "",
            password: ""
        };

        if (formData.firstName.trim() === '') {
            newErrors.firstName = 'First Name is required';
            isValid = false;
        }

        if (formData.lastName.trim() === '') {
            newErrors.lastName = 'Last Name is required';
            isValid = false;
        }
        const cleanedPhoneNumber = values.textmask.replace(/\D/g, '');
        if (cleanedPhoneNumber.trim() === '') {
            newErrors.phoneNumber = 'Phone Number is required';
            isValid = false;
        }
        else if (!/^(067|095|099|066|063|098|097|096)\d{7}$/.test(cleanedPhoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number format';
            isValid = false;
        }

        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (formData.email.trim() === '' || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }

        if (formData.password.trim() === '') {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 7) {
            newErrors.password = 'Password must be at least 7 characters long';
            isValid = false;
        } else if (!/[a-zA-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one letter';
            isValid = false;
        } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one symbol';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handlePasswordToggle = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleConfirmPasswordToggle = () => {
        setConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
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

    const validatePhoneNumber = (value: string) => {
        const isValidPrefix = /^(067|095|099|066|063|098|097|096)/.test(value.substr(0, 3));

        const isValidDigits = /^\d{7}$/.test(value.substr(3));

        const isValid = isValidPrefix && isValidDigits;

        setErrors((prevErrors) => ({
            ...prevErrors,
            phoneNumber: isValid ? '' : 'Invalid phone number format',
        }));
    };

    const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        setFormData((prevData) => ({
            ...prevData,
            imageFile: file !== undefined ? file : null,
        }));
    };

    const handleSelectFile = () => {
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    };

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto">
                    <div className="bg-white rounded-md shadow-md p-5 flex flex-col lg:flex-row">
                        <div className="w-full lg:w-2/4 p-5 lg:mb-0">

                            <div className="bg-white-container-register flex flex-col justify-center items-center h-full">
                                <h1 className="text-white text-7xl hover:text-indigo-300">estro</h1>
                                <p className="text-white text-sx mb-10 hover:text-indigo-300">SHOES & ACCESSORIES</p>

                                <br />

                                <p className="text-center text-sx hover:text-indigo-300">
                                    If you don't have an account yet, register now
                                </p>
                                <br />

                                <p className="text-center text-sx hover:text-indigo-300">
                                    Register and get the most out of the Estro bonus program
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
                        <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0 flex flex-col justify-center items-center">
                            {isRegistered ? (
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Registration Successful</h2>
                                    <br />
                                    <p className="text-gray-500">You have successfully registered. Please proceed to login.</p>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <div className="sm:mx-auto sm:w-full sm:max-w-sm" >
                                        <h2 className="mt-5 mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                            Registration
                                        </h2>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <ThemeProvider theme={theme}>
                                            <FormControl fullWidth className={classes.margin} variant="outlined">

                                                <TextField
                                                    label="First Name"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    error={!!errors.firstName}
                                                />
                                                {errors.firstName ? (
                                                    <div className="h-6 text-xs text-red-500">Error: {errors.firstName}</div>
                                                ) : (<div className="h-6 text-xs "> </div>)}
                                            </FormControl>

                                            <FormControl fullWidth className={classes.margin} variant="outlined">
                                                <TextField
                                                    label="Last Name"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    error={!!errors.lastName}
                                                />
                                                {errors.lastName ? (
                                                    <div className="h-6 text-xs text-red-500">Error: {errors.lastName}</div>
                                                ) : (<div className="h-6 text-xs "> </div>)}
                                            </FormControl>

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
                                        </ThemeProvider>

                                        <FormControl fullWidth className={classes.margin} variant="outlined">
                                            <div className="mb-5 mt-2 flex justify-center items-center gap-x-3 relative">
                                                {selectedImage ? (
                                                    <img
                                                        src={selectedImage}
                                                        alt="Selected"
                                                        className="h-12 w-12 rounded-full"
                                                    />
                                                ) : (
                                                    <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageSelect}
                                                    style={{ display: 'none' }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="primary"
                                                    className={classes.margin}
                                                    onClick={handleSelectFile}
                                                >
                                                    Select
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <ThemeProvider theme={theme}>

                                            <FormControl fullWidth className={classes.margin} >
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

                                            <FormControl fullWidth className={classes.margin} variant="outlined">
                                                <TextField
                                                    label="Confirm Password "
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
                                        </ThemeProvider>

                                        <FormControl fullWidth className={classes.margin} variant="outlined">
                                            <Button className={classes.button} type="submit" variant="contained" size="large" color="primary" disableElevation>
                                                Register
                                            </Button>
                                        </FormControl>

                                    </form>

                                </div >
                            )}
                        </div >

                        <div className={`fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 ${errorMessage ? 'block' : 'hidden'}`}>
                            <div className="bg-white p-4 rounded-md shadow-md">
                                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        </>
    );
}

export default RegisterPage;