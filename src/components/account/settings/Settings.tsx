import Breadcrumb from '../../Dashboard/components/Breadcrumb';
import { useSelector } from 'react-redux';
import { IAuthReducerState } from '../../../store/accounts/AuthReducer';
import { ChangeEventHandler, useEffect, useState } from 'react';
import axios from 'axios';
import { IUserEdit } from '../../../interfaces/Auth/IUserEdit';
import { Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment/moment';
import { IIUserImageEdit } from '../../../interfaces/Auth/IIUserImageEdit';
import {APP_ENV} from "../../../env/config";

const Settings = () => {
  const baseUrl = APP_ENV.BASE_URL;
  const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState)
  const [userEdit, setUserEdit] = useState<IUserEdit>();
  const [userImage, setUserImage] = useState<string>();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<IUserEdit>(`${baseUrl}/api/AccountControllers/${user?.Email}`)
      .then(async resp => {
        setUserEdit(resp.data);
        setUserImage(resp.data.imagePath);
        const birthdayDate = moment(resp.data.birthday, 'YYYY-MM-DD').format('YYYY-MM-DD');

        form.setFieldsValue({
          id: resp.data.id,
          firstName: resp.data.firstName,
          lastName: resp.data.lastName,
          email: resp.data.email,
          emailConfirmed: resp.data.emailConfirmed,
          imagePath: resp.data.imagePath,
          phoneNumber: resp.data.phoneNumber,
          birthday: birthdayDate,
          role: resp.data.role
        });
      })
      .catch(error => {
        console.error('Error user data:', error);
      });
  }, [user?.Email]);

  const beforeUpload = (file: File) => {
    const isImage = /^image\/\w+/.test(file.type);
    if (!isImage) {
      message.error('Оберіть файл зображення!');
    }
    const isLt2M = file.size / 1200 / 1200 < 10;
    if (!isLt2M) {
      message.error('Розмір файлу не повинен перевищувать 10MB!');
    }
    console.log("is select", isImage && isLt2M);
    return isImage && isLt2M;
  };

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await axios.post(`${baseUrl}/api/Image/DeleteUserImage`, { image: userImage }, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      await axios.post(`${baseUrl}/api/AccountControllers/DeleteUserImage`, { email: userEdit?.email }, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setUserImage("");
      console.log("User image deleted successfully");
    } catch (error) {
      console.error('Error deleting user image:', error);
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    if (!beforeUpload(file)) {
      return;
    }
    
    
    try {
      if (userImage != "")
      {
        await axios.post(`${baseUrl}/api/Image/DeleteUserImage`, { image: userImage }, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      }

      const resp = await axios.post(`${baseUrl}/api/Image/CreateUserImage`, { ImageFile: file }, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setUserImage(resp.data);
      const editDTO : IIUserImageEdit = {
        email: userEdit?.email || "",
        imagePath: resp.data
      };
      
      await axios.post(`${baseUrl}/api/AccountControllers/EditUserImage`, editDTO, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("User image deleted successfully");
    } catch (error) {
      console.error('Error deleting user image:', error);
    }
  };

  const onSubmit = async (values: any) => {
    const model: IUserEdit = {
      id: values.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      imagePath: userImage || "",
      phoneNumber: values.phoneNumber,
      birthday: new Date(values.birthday),
      password: values.password,
      role: values.role,
      emailConfirmed: values.emailconfirmed

    };
    
    try {
        await axios.post(`${baseUrl}/api/AccountControllers/Edit`, model, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        navigate('/');
    }
    catch (ex) {
        message.error('Error editing user!');
    }
  };
  const onSubmitFailed = (errorInfo: any) => {
    console.log("Error Form data", errorInfo);
  }

  const handleCancel = () => {
    navigate('/');
  }

  return (
    <>
      <div className="mx-auto max-w-270 ">

        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-gray-100 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <Form
                  form={form}
                  initialValues={{ remember: true }}
                  onFinish={onSubmit}
                  onFinishFailed={onSubmitFailed}
                >

                  <div className={userEdit?.id ? "sm:col-span-2 hidden" : "sm:col-span-2"}>
                    <label htmlFor="id" className="block text-sm font-medium leading-6 text-gray-900">
                      id
                    </label>
                    <Form.Item
                      name="id"
                      htmlFor="id"
                      noStyle>
                      <Input
                        id="id"
                        name="id"
                        type="id"
                        autoComplete="id"
                        required
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </Form.Item>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="firstName"
                      >
                        First Name
                      </label>
                      <Form.Item className="relative"
                        name="firstName"
                        htmlFor="firstName">
                        {/* <span className="absolute left-4.5 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span> */}
                        <Input
                          className="w-full rounded border border-stroke bg-gray py-3 text-black"
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="Enter Your Name"
                          autoComplete="firstName"
                          required
                        />
                      </Form.Item>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="firstName"
                      >
                        Last Name
                      </label>
                      <Form.Item className="relative"
                        name="lastName"
                        htmlFor="lastName">

                        <Input
                          className="w-full rounded border border-stroke bg-gray py-3 text-black"
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Enter Your Last Name"
                          autoComplete="lastName"
                          required
                        />
                      </Form.Item>
                    </div>

                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <Form.Item className="relative"
                        name="phoneNumber"
                        htmlFor="phoneNumber">
                        <Input
                          className="w-full rounded border border-stroke bg-gray py-3 text-black"
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          placeholder="+3800 0000 000"

                        />
                      </Form.Item>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="email"
                      >
                        Email Address
                      </label>
                      <Form.Item className="relative"
                        name="email"
                        htmlFor="email">

                                {/* <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span> */}
                        {user?.AuthType == "google" ? (
                            <Input
                                className="w-full rounded border border-stroke bg-gray py-3 pr-4.5 text-black "
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                readOnly

                            />
                        ) : (
                            <Input
                                className="w-full rounded border border-stroke bg-gray py-3 pr-4.5 text-black "
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                            />
                        )}


                      </Form.Item>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="birthday"
                    >
                      Birthday
                    </label>
                    <Form.Item className="relative"
                      name="birthday"
                      htmlFor="birthday">
                      <Input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        name="birthday"
                        id="birthday"
                      />
                    </Form.Item>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="role"
                      >
                        Role
                      </label>
                      <Form.Item className="relative"
                        name="role"
                        htmlFor="role">
                        <Input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="role"
                          id="role"
                          readOnly
                        />
                      </Form.Item>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="emailConfirmed"
                      >
                        Email Confirmed
                      </label>
                      <Form.Item className="relative"
                        name="emailConfirmed"
                        htmlFor="emailConfirmed">
                        <Input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="emailConfirmed"
                          id="emailConfirmed"
                          readOnly
                        />
                      </Form.Item>
                    </div>
                  </div>

                  {user?.AuthType == "standard" ? (
                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <label
                              className="mb-3 block text-sm font-medium text-black dark:text-white"
                              htmlFor="password"
                          >
                            Password
                          </label>
                          <Form.Item className="relative"
                                     name="password"
                                     htmlFor="password">
                            <Input
                                className="w-full rounded border border-stroke bg-gray py-3 text-black"
                                type="password"
                                name="password"
                                id="password"
                                required
                                placeholder="Enter your password"
                            />
                          </Form.Item>
                        </div>

                        <div className="w-full sm:w-1/2">
                          <label
                              className="mb-3 block text-sm font-medium text-black dark:text-white"
                              htmlFor={"confirm"}
                          >
                            Confirm Password
                          </label>
                          <Form.Item className="relative"
                                     name="confirm_password"
                                     htmlFor="confirm_password"
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
                                className="w-full rounded border border-stroke bg-gray py-3 pr-4.5 text-black input-container-confirm-password"
                                type="password"
                                name="confirm_password"
                                id={"confirm"}
                                placeholder="Confirm Your password"
                            />
                          </Form.Item>
                        </div>
                      </div>

                  ) : (null)}


                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                     
                      type="submit" onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      // className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1 "
                      className="flex justify-center rounded bg-indigo-600 py-2 px-6 text-medium font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:bg-opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 custom-button-style !h-full"
                      
                      type="submit"
                    // onClick={fireToast}
                    >
                      Save
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-gray-100 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Your Photo
                </h3>
              </div>
              <div className="p-7">
                {/* <form action="#"> */}

                <div className="mb-4 flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full">
                    {userImage ? (
                        user?.AuthType === 'standard' ? (
                            <img src={`${baseUrl}/uploads/${userImage}`} alt="User" className="rounded-full" />
                        ) : (
                            <img src={`${userImage}`} alt="User" className="rounded-full" />
                        )
                    ) : (
                        <img src={`${baseUrl}/uploads/user404.webp`} alt="User" className="rounded-full" />
                    )}
                  </div>

                  <div>
                    <span className="mb-1.5 text-black dark:text-white">
                      Edit your photo
                    </span>
                    <span className="flex gap-2.5">
                      {userImage ? (
                        <button className="text-sm hover:text-primary"
                          onClick={(e) => handleRemove(e)}
                        >
                          Delete

                        </button>
                      ) : (null)}
                      {/* <button className="text-sm hover:text-primary"
                      // onClick={(e) => handleChange(e)}
                     
                      >
                        Update
                      </button> */}

                    </span>
                  </div>
                </div>

                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                >
                  <input
                    onChange={handleChange}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                          fill="#3C50E0"
                        />
                      </svg>
                    </span>
                    <p>
                      <span className="text-primary">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                    <p>(max, 800 X 800px)</p>
                  </div>
                </div>

                {/* <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                      type="submit"
                    >
                      Save
                    </button>
                  </div> */}
                {/* </form> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;