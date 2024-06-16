import axios from 'axios';
import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import { IRegister } from '../../../../../interfaces/Auth/IRegister';
import 'tailwindcss/tailwind.css';
import '../../../../../index.css';
import { APP_ENV } from "../../../../../env/config";
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { GiftIcon } from '@heroicons/react/24/outline';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { ThemeProvider } from '@material-ui/core/styles';
import '../../../../../satoshi.css';
import { useGoogleLogin } from "@react-oauth/google";
import ReactCodeInput from "react-code-input";
import Modal from '../../../../cropImage/Modal';
import { validateForm } from '../../../../../validations/account/register-validations';
import TextMaskCustom from '../../../../../services/custom/phone-services';
import { State } from '../../../../../interfaces/Custom/Phone/State';
import { validatePhoneNumber } from '../../../../../validations/custom/register-phone-validations';
import { register } from '../../../../../services/accounts/account-services';
import { theme } from '../../../../../theme/theme';
import { useStyles } from '../../../../../theme/Styles';

const RegisterPage = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const twilio_auth_token = APP_ENV.TWILIO_AUTH_TOKEN;
    const twilio_acc_sid = APP_ENV.TWILIO_ACC_SID;
    const twilio_service_sid = APP_ENV.TWILIO_SERVICE_SID;

    const classes = useStyles();
    const [isRegistered, setIsRegistered] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [values, setValues] = useState<State>({
        textmask: '(   )    -  -  ',
    });
    const [isChosen, setIsChosen] = useState(false);
    const [isEmail, setIsEmail] = useState(false);
    const [isPhone, setIsPhone] = useState(false);
    const [isTryToCode, setIsTryToCode] = useState(false);
    const [verifySid, setVerifySid] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [pinCode, setPinCode] = useState("");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (isDisabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsDisabled(false);
        }
        return () => clearInterval(timer);
    }, [isDisabled, countdown]);

    const [formData, setFormData] = useState<IRegister>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        imageFile: null,
        role: 'User',
        authType: "standard"
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        authType: "standard"
    });

    const handlePinChange = (value: SetStateAction<string>) => {
        setPinCode(value);
    };

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
        const { isValid, newErrors } = validateForm(formData, values.textmask);
        setErrors(newErrors);
        if (isValid) {
            try {
                await register(formData);
                setIsRegistered(true);
                setIsEmail(false);
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

    const handlePhoneSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await axios.post(
                `https://verify.twilio.com/v2/Services/${twilio_service_sid}/VerificationCheck`,
                new URLSearchParams({
                    Code: pinCode,
                    VerificationSid: verifySid
                    // VerificationSid: verifySid.verificationSid
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

            formData.authType = "phone";
            try {
                await register(formData);
                setIsRegistered(true);
                setIsPhone(false);
            } catch (error) {
                console.error("Register error:", error);
                setErrorMessage("Register error. Try again later");
                setTimeout(() => {
                    setErrorMessage("");
                }, 1000);
            }
        }
        catch (error) {
            setPinCode("");
            setIsDisabled(true);
            setIsTryToCode(false);
            setTimeout(() => {
                setIsDisabled(false);
            }, 30000); // 30 seconds

            console.error("Verification error:", error);
            setErrorMessage("Invalid code or verification failed");
            setTimeout(() => {
                setErrorMessage("");
            }, 1000);
        }
    };

    const googleSuccess = async (response: { access_token: any; }) => {
        if (response) {
            try {
                const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${response.access_token}`,
                        Accept: 'application/json'
                    }
                });

                const googleUser = res.data;
                console.log(googleUser);
                const formData = new FormData();
                formData.append('UserName', googleUser?.name);
                formData.append('FirstName', googleUser?.given_name);
                formData.append('LastName', googleUser?.family_name);
                formData.append('Email', googleUser?.email);
                formData.append('AuthType', 'google');
                formData.append('ImagePath', googleUser?.picture);
                formData.append('ClientId', googleUser?.id);

                await axios.post(`${baseUrl}/api/AccountControllers/Registration`, formData);
                setIsChosen(true);
                setIsRegistered(true);

            } catch (error) {
                console.error("Register error:", error);
                setErrorMessage("Register error. Try again later");
                setTimeout(() => {
                    setErrorMessage("");
                }, 1000);
            }
        }
    };

    const googleErrorMessage = (error: any) => {
        console.log(error);
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

        validatePhoneNumber(cleanedValue, errors, setErrors);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setModalOpen(true);
        }
    };

    const handleImageSelect = (file: File) => {
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

    const registerGoogle = useGoogleLogin({
        onSuccess: googleSuccess,
        onError: googleErrorMessage
    });

    async function sendSMS() {
        try {
            const response = await axios.post(`${baseUrl}/api/AccountControllers/SendSMS?phone=${formData.phoneNumber}`, {});

            if (response.status === 200) {
                setIsTryToCode(true);
                console.log(response.data);
                setVerifySid(response.data);
            }

        } catch (error) {
            console.error("Register error:", error);
            setErrorMessage("Invalid phone number");
            setTimeout(() => {
                setErrorMessage("");
            }, 1000);
        }
    }

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto">
                    <div className="bg-white rounded-md shadow-md p-5 flex flex-col lg:flex-row">
                        <div className="w-full lg:w-2/4 p-5 lg:mb-0">

                            <div className="bg-white-container-register flex flex-col justify-center items-center h-full">
                                <h1 className="text-white text-9xl hover:text-indigo-300">estro</h1>
                                <p className="text-white text-sx mb-10 hover:text-indigo-300">SHOES, CLOTHING & ACCESSORIES</p>

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
                            {!isChosen ? (

                                <div className={"flex-col flex "}>
                                    <div className={"text-center mb-3"}>
                                        <h2>Choose your option:</h2>
                                    </div>
                                    <div className={"flex-col bg-gray-100 p-10 rounded-2xl gap-2 w-59 flex"}>
                                        <Button onClick={() => { setIsEmail(true); setIsChosen(true); }} className={"h-20"} size="large">
                                            <svg className={"h-20 -ml-2"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g fill="none" stroke="#383843" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M1.75 3.75h12.5v9.5H1.75z" /><path d="m2.25 4.25l5.75 5l5.75-5" /></g></svg>
                                            <p className={"ml-2 lowercase"}>Email</p>
                                        </Button>
                                        <Button onClick={() => { setIsPhone(true); setIsChosen(true); }} className={"h-20"} size="large">
                                            <svg className={"h-20 -ml-4"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="#3d3d3d" d="M9 14a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zM7 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" /></svg>
                                            <p className={"lowercase"}>Phone</p>
                                        </Button>
                                        <Button onClick={() => registerGoogle()} className={"h-20"} size="large">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="#383843" d="M881 442.4H519.7v148.5h206.4c-8.9 48-35.9 88.6-76.6 115.8c-34.4 23-78.3 36.6-129.9 36.6c-99.9 0-184.4-67.5-214.6-158.2c-7.6-23-12-47.6-12-72.9s4.4-49.9 12-72.9c30.3-90.6 114.8-158.1 214.7-158.1c56.3 0 106.8 19.4 146.6 57.4l110-110.1c-66.5-62-153.2-100-256.6-100c-149.9 0-279.6 86-342.7 211.4c-26 51.8-40.8 110.4-40.8 172.4S151 632.8 177 684.6C240.1 810 369.8 896 519.7 896c103.6 0 190.4-34.4 253.8-93c72.5-66.8 114.4-165.2 114.4-282.1c0-27.2-2.4-53.3-6.9-78.5" /></svg>
                                            <p className={"ml-1.5 lowercase"}>Google</p>
                                        </Button>
                                    </div>

                                </div>

                            ) : (
                                isRegistered && !isEmail && !isPhone ? (
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-gray-900">Registration Successful</h2>
                                        <br />
                                        <p className="text-gray-500">You have successfully registered. Please proceed to login.</p>
                                    </div>
                                ) : (
                                    isEmail ? (
                                        <div className="mb-4">
                                            <form onSubmit={handleSubmit}>
                                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                                <h2 className="mt-5 mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                                    Email Registration
                                                </h2>
                                            </div>

                                            <ThemeProvider theme={theme}>
                                                <FormControl fullWidth variant="outlined">
                                                    <TextField
                                                        label="First Name"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        error={!!errors.firstName}
                                                        autoComplete="firstName"
                                                    />
                                                    {errors.firstName ? (
                                                        <div className="h-6 text-xs text-red-500">Error: {errors.firstName}</div>
                                                    ) : (
                                                        <div className="h-6 text-xs"> </div>
                                                    )}
                                                </FormControl>

                                                <FormControl fullWidth variant="outlined">
                                                    <TextField
                                                        label="Last Name"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        error={!!errors.lastName}
                                                        autoComplete="lastName"
                                                    />
                                                    {errors.lastName ? (
                                                        <div className="h-6 text-xs text-red-500">Error: {errors.lastName}</div>
                                                    ) : (
                                                        <div className="h-6 text-xs"> </div>
                                                    )}
                                                </FormControl>

                                                <FormControl fullWidth variant="outlined">
                                                    <TextField
                                                        label="Email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        error={!!errors.email}
                                                        autoComplete="email"
                                                    />
                                                    {errors.email ? (
                                                        <div className="h-6 text-xs text-red-500">Error: {errors.email}</div>
                                                    ) : (
                                                        <div className="h-6 text-xs"> </div>
                                                    )}
                                                </FormControl>
                                            </ThemeProvider>

                                            <FormControl fullWidth variant="outlined">
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
                                                        // onChange={handleImageSelect}
                                                        onChange={handleFileChange}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        color="primary"
                                                        className={classes.button}
                                                        onClick={handleSelectFile}
                                                    >
                                                        select
                                                    </Button>
                                                </div>
                                            </FormControl>

                                            {modalOpen && selectedFile && (
                                                <Modal
                                                    changeImage={handleImageSelect}
                                                    closeModal={() => setModalOpen(false)}
                                                    file={selectedFile}
                                                />
                                            )}

                                            <ThemeProvider theme={theme}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Phone Number</InputLabel>
                                                    <Input
                                                        name="textmask"
                                                        value={values.textmask}
                                                        onChange={handleChangePhoneNumber}
                                                        id="formatted-text-mask-input"
                                                        inputComponent={TextMaskCustom as any}
                                                        error={!!errors.phoneNumber}
                                                        placeholder="(099) 00-00-000"
                                                        autoComplete="phone"
                                                    />
                                                    {errors.phoneNumber ? (
                                                        <div className="h-6 text-xs text-red-500">Error: {errors.phoneNumber}</div>
                                                    ) : (
                                                        <div className="h-6 text-xs"> </div>
                                                    )}
                                                </FormControl>

                                                <FormControl fullWidth variant="outlined">
                                                    <TextField
                                                        label="Password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        error={!!errors.password}
                                                        autoComplete="password"
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
                                                    ) : (
                                                        <div className="h-6 text-xs"> </div>
                                                    )}
                                                </FormControl>

                                                <FormControl fullWidth variant="outlined">
                                                    <TextField
                                                        label="Confirm Password"
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        error={!!errors.confirmPassword}
                                                        helperText={errors.confirmPassword}
                                                        autoComplete="confirmPassword"
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
                                                    ) : (
                                                        <div className="h-12 text-xs"> </div>
                                                    )}
                                                </FormControl>
                                            </ThemeProvider>

                                            <FormControl fullWidth variant="outlined">
                                                <Button
                                                    className={classes.button}
                                                    type="submit"
                                                    // onClick={handleSubmit}
                                                    variant="contained"
                                                    size="large"
                                                    color="primary"
                                                    disableElevation
                                                >
                                                    Register
                                                </Button>
                                                <Button
                                                    className={classes.button}
                                                    type="button"
                                                    variant="contained"
                                                    size="large"
                                                    color="primary"
                                                    onClick={() => { setIsChosen(false); setIsEmail(false); }}
                                                >
                                                    Cancel
                                                </Button>
                                            </FormControl>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="mb-4">
                                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                                <h2 className="mt-5 mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                                    Phone Registration
                                                </h2>
                                            </div>

                                            <form onSubmit={handlePhoneSubmit}>
                                                <ThemeProvider theme={theme}>
                                                    <FormControl fullWidth variant="outlined">
                                                        <TextField
                                                            label="First Name"
                                                            name="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleChange}
                                                            error={!!errors.firstName}
                                                        />
                                                        {errors.firstName ? (
                                                            <div className="h-6 text-xs text-red-500">Error: {errors.firstName}</div>
                                                        ) : (
                                                            <div className="h-6 text-xs"> </div>
                                                        )}
                                                    </FormControl>

                                                    <FormControl fullWidth variant="outlined">
                                                        <TextField
                                                            label="Last Name"
                                                            name="lastName"
                                                            value={formData.lastName}
                                                            onChange={handleChange}
                                                            error={!!errors.lastName}
                                                        />
                                                        {errors.lastName ? (
                                                            <div className="h-6 text-xs text-red-500">Error: {errors.lastName}</div>
                                                        ) : (
                                                            <div className="h-6 text-xs"> </div>
                                                        )}
                                                    </FormControl>


                                                </ThemeProvider>

                                                <FormControl fullWidth variant="outlined">
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
                                                            onChange={handleFileChange}
                                                            // onChange={handleImageSelect}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            color="primary"
                                                            className={classes.button}
                                                            onClick={handleSelectFile}
                                                        >
                                                            select
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <ThemeProvider theme={theme}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Phone Number</InputLabel>
                                                        <Input
                                                            name="textmask"
                                                            value={values.textmask}
                                                            onChange={handleChangePhoneNumber}
                                                            id="formatted-text-mask-input"
                                                            inputComponent={TextMaskCustom as any}
                                                            error={!!errors.phoneNumber}
                                                            placeholder="(099) 00-00-000"
                                                        />
                                                        {errors.phoneNumber ? (
                                                            <div className="h-6 text-xs text-red-500">Error: {errors.phoneNumber}</div>
                                                        ) : (
                                                            <div className="h-6 text-xs"> </div>
                                                        )}
                                                    </FormControl>
                                                    {isTryToCode ? (
                                                        <div className={"mb-3 flex justify-center"}>
                                                            <ReactCodeInput
                                                                inputMode={"numeric"}
                                                                name="pinCode"
                                                                fields={6}
                                                                onChange={handlePinChange}
                                                                value={pinCode}
                                                            />

                                                        </div>
                                                    ) : null}


                                                </ThemeProvider>

                                                <FormControl fullWidth variant="outlined">
                                                    {!isTryToCode ? (
                                                        <Button
                                                            className={classes.button}
                                                            type="button"
                                                            variant="contained"
                                                            size="large"
                                                            color="primary"
                                                            disableElevation
                                                            disabled={isDisabled}
                                                            onClick={sendSMS}
                                                        >
                                                            {isDisabled ? `Send code (${countdown}s)` : 'Send code'}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            className={classes.button}
                                                            type="submit"
                                                            // onClick={handleSubmit}
                                                            variant="contained"
                                                            size="large"
                                                            color="primary"
                                                            disableElevation
                                                        >
                                                            Register
                                                        </Button>

                                                    )}

                                                    <Button
                                                        className={classes.button}
                                                        type="button"
                                                        variant="contained"
                                                        size="large"
                                                        color="primary"
                                                        onClick={() => { setIsChosen(false); setIsPhone(false); setIsDisabled(false); setIsTryToCode(false); }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </FormControl>
                                            </form>
                                        </div>
                                    )

                                )
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