import { Form, Input, } from "antd";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IRegister } from '../../interfaces/Auth/IRegister';
import 'tailwindcss/tailwind.css';
import '../../../index.css';
import {APP_ENV} from "../../env/config";

const Register = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const onSubmit = async (values: IRegister) => {
        try {
            await axios.post(`${baseUrl}/api/AccountControllers/Registration`, values);

            navigate("/login");
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
                        Registration
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Form className="space-y-6" onFinish={onSubmit}>
                        <div>
                            <label htmlFor="name" className="mb-3 block text-sm font-medium text-black dark:text-white">
                                First Name
                            </label>
                            <Form.Item className="mt-2"
                                name="firstName"
                                htmlFor="firstName">
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="firstName"
                                    autoComplete="firstName"
                                    required
                                    className="w-full rounded border border-stroke bg-gray py-3 text-black"
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <label htmlFor="name" className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Last Name
                            </label>
                            <Form.Item className="mt-2"
                                name="lastName"
                                htmlFor="lastName">
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="lastName"
                                    autoComplete="lastName"
                                    required
                                    className="w-full rounded border border-stroke bg-gray py-3 text-black"
                                />
                            </Form.Item>
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Email address
                            </label>
                            <Form.Item className="mt-2"
                                name="email"
                                htmlFor="email">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full rounded border border-stroke bg-gray py-3 text-black"
                                />
                            </Form.Item>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Password
                                </label>
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

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Confirm Password
                                </label>
                            </div>
                            <Form.Item className="mt-2"
                                name="confirm_password"
                                htmlFor={"confirm_password"}
                                dependencies={['password']}
                                hasFeedback
                                rules={[{ required: true, message: 'Confirm Password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The password does not match!'));
                                    },
                                }),]}
                            >
                                <Input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type="password"
                                    autoComplete="confirm_password"
                                    required
                                    className="w-full rounded border border-stroke bg-gray py-3 pr-4.5 text-black input-container-confirm-password"
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded bg-indigo-600 py-2 px-6 text-medium font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:bg-opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 custom-button-style !h-full"
                            >
                                Register
                            </button>
                        </div>
                    </Form>
                    <p className="mt-10 text-center text-sm text-gray-500">
                        If you have an account, please{' '}
                        <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" >
                            <Link to={"/login"}>Sign In</Link>
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
export default Register;