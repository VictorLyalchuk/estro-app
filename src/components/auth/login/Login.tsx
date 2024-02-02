import { Form, Input, } from "antd";
import { ILogin } from '../../interfaces/Auth/ILogin';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { IUser } from '../../interfaces/Auth/IUser';
import { AuthReducerActionType } from './AuthReducer';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import 'tailwindcss/tailwind.css';
import '../../../index.css';
import {APP_ENV} from "../../env/config";

const Login = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const [errorMessage, setErrorMessage] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onSubmit = async (values: ILogin) => {
        try {
            const response = await axios.post(`${baseUrl}/api/AccountControllers/Login`, values);
            const { token } = response.data;
            const user = jwtDecode(token) as IUser;
            dispatch({
                type: AuthReducerActionType.LOGIN_USER,
                payload: {
                    Email: user.Email,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                    Role: user.Role,
                    ImagePath: user.ImagePath
                } as IUser,
            });

            localStorage.setItem("token", token);
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("Invalid email or password");
        }
    }
    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8" >
                <div className="sm:mx-auto sm:w-full sm:max-w-sm" >
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Form className="space-y-6" onFinish={onSubmit}>
                        <div>
                            <label htmlFor="email" 
                            // className="block text-sm font-medium leading-6 text-gray-900"
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            
                            >
                                Email address
                            </label>
                            <Form.Item className="relative"
                                name="email"
                                htmlFor="email">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full rounded borde border-stroke bg-gray py-3 text-black"

                                    // className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </Form.Item>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" 
                                className="mb-3 block text-sm font-medium text-black dark:text-white"

                                >
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <Form.Item className="mt-2"
                                name="password"
                                htmlFor={"password"}>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full rounded border border-stroke bg-gray py-3 text-black"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item>
                            <button
                                type="submit"
                                // className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:bg-opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 custom-button-style !h-full"
                                className="flex w-full justify-center rounded bg-indigo-600 py-2 px-6 text-medium font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:bg-opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 custom-button-style !h-full"
                            
                            >
                                Sign in
                            </button>
                        </Form.Item>
                    </Form>
                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" >
                            <Link to={"/register"}>Registration</Link>
                        </span>
                    </p>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    </p>
                </div>
            </div >
        </>
    )
}
export default Login;