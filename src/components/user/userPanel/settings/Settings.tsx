import { ChangeEventHandler, useEffect, useState } from 'react';
import { IUserEdit } from '../../../../interfaces/Auth/IUserEdit';
import moment from 'moment/moment';
import { IIUserImageEdit } from '../../../../interfaces/Auth/IIUserImageEdit';
import { useDispatch } from "react-redux";
import { FormControl, TextField, ThemeProvider, createTheme } from '@material-ui/core';
import { beforeUpload, createUserImage, deleteUserImage, editUserImage } from '../../../../services/images/images-services';
import { APP_ENV } from '../../../../env/config';
import { refreshRedux, refreshToken } from '../../../../services/accounts/account-services';

interface SettingsUserProps {
  userProfile?: IUserEdit;
}

const theme = createTheme({
  typography: {
    fontFamily: 'Satoshi, sans-serif',
  },
});

const Settings: React.FC<SettingsUserProps> = ({ userProfile }) => {
  const baseUrl = APP_ENV.BASE_URL;
  const dispatch = useDispatch();
  const [userImage, setUserImage] = useState<string>('');
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthday: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthday: '',
    password: '',
  });

  useEffect(() => {
    if (userProfile) {
      const birthdayDate = moment(userProfile.birthday, 'YYYY-MM-DD').format('YYYY-MM-DD');
      console.log(birthdayDate);
      setFormData({
        id: userProfile.id,
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phoneNumber: '+38' + (userProfile.phoneNumber || ''),
        birthday: birthdayDate,
        password: '',
      });
      setUserImage(userProfile.imagePath);
    }
  }, [userProfile]);

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
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      birthday: string;
      password: string;
      confirmPassword: string;
    } = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      birthday: "",
      password: "",
      confirmPassword: "",
    };

    if (formData.firstName.trim() === '') {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    }

    if (formData.lastName.trim() === '') {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    }

    if (formData.email.trim() === '' || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }
    if (formData.password.trim() === '') {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    else if (formData.password.trim() !== userProfile?.password) {
      newErrors.password = 'Password is not correct';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const changeImage: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];

    try {
      const isValid = await beforeUpload(file);

      if (!isValid) {
        return;
      }

      if (userImage) {
        await deleteUserImage(userImage);
      }
      const resp = await createUserImage(file);
      const editDTO: IIUserImageEdit = {
        email: userProfile?.email || "",
        imagePath: resp as string,
      };
      setUserImage(resp as string);
      await editUserImage(editDTO);
      await refreshToken();
      await refreshRedux(dispatch);
    } catch (error) {
      console.error('Error changing image:', error);
    }
  };

  const onSubmit = async () => {
    if (validateForm()) {
      const model: IUserEdit = {
        id: "formData.id",
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        imagePath: userImage || "",
        phoneNumber: formData.phoneNumber,
        birthday: new Date(formData.birthday),
        password: formData.password,
      };
      console.log(model);

      try {
        // await axios.post(`${baseUrl}/api/AccountControllers/Edit`, model, {
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // });
        // navigate('/');
      }
      catch (ex) {
        // message.error('Error editing user!');
      }
    }
  };

  return (
    <>
      <div>
        <main >
          <div className="bg-white rounded-md shadow-md mb-8 mt-8">
            <div className="mx-auto max-w-2xl px-8 py-8 sm:px-6 sm:pt-8 lg:max-w-7xl lg:px-8">
              <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">

                <ThemeProvider theme={theme}>
                  <div className=" lg:col-span-9">

                    {/* Profile section */}
                    <div className="px-4 py-6 sm:p-6 lg:pb-8">
                      <div>
                        <h2 className="text-lg font-medium leading-6 text-gray-900">Profile Settings</h2>
                      </div>

                      <div className="mt-6 flex flex-col lg:flex-row">
                        <div className="flex-grow space-y-6">

                          <div className="hidden">
                            <div className="mt-2 flex rounded-md shadow-sm">
                              <FormControl fullWidth variant="outlined">
                                <TextField
                                  name="id"
                                  id="id"
                                  value={formData.id}
                                  className="mt-1"
                                  size="small"
                                  hidden
                                />
                              </FormControl>
                            </div>
                          </div>


                          <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                              Email
                            </label>
                            <div className="mt-2 flex rounded-md shadow-sm">
                              <FormControl fullWidth variant="outlined">
                                <TextField
                                  name="email"
                                  id="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  error={!!errors.email}
                                  className="mt-1"
                                  size="small"
                                />
                                {errors.email ? (
                                  <div className="h-6 text-xs text-red-500">Error: {errors.email}</div>
                                ) : (<div className="h-6 text-xs "> </div>)}
                              </FormControl>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
                              Phone
                            </label>
                            <div className="mt-2">
                              <FormControl fullWidth variant="outlined">
                                <TextField
                                  name="phoneNumber"
                                  id="phoneNumber"
                                  value={formData.phoneNumber}
                                  onChange={handleChange}
                                  error={!!errors.phoneNumber}
                                  className="mt-1"
                                  size="small"
                                />
                                {errors.phoneNumber ? (
                                  <div className="h-6 text-xs text-red-500">Error: {errors.phoneNumber}</div>
                                ) : (<div className="h-6 text-xs "> </div>)}
                              </FormControl>
                            </div>

                          </div>
                        </div>

                        <div className="mt-6 flex-grow lg:ml-6 lg:mt-0 lg:flex-shrink-0 lg:flex-grow-0">
                          <p className="text-sm font-medium leading-6 text-gray-900" aria-hidden="true">
                            Photo
                          </p>
                          <div className="mt-2 lg:hidden">
                            <div className="flex items-center">
                              <div
                                className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                                aria-hidden="true"
                              >
                                {userImage ? (
                                  <img src={`${baseUrl}/uploads/${userImage}`} alt="User" className="h-12 w-12 rounded-full" />
                                ) : (
                                  <img src={`${userImage}`} alt="User" className="h-14 w-14 rounded-full" />
                                )}
                              </div>
                              <div className="relative ml-5">
                                <input
                                  id="mobile-user-photo"
                                  onChange={changeImage}
                                  name="user-photo"
                                  type="file"
                                  className="peer absolute h-full w-full rounded-md opacity-0"
                                />
                                <label
                                  htmlFor="mobile-user-photo"
                                  className="pointer-events-none block rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 peer-hover:ring-gray-400 peer-focus:ring-2 peer-focus:ring-sky-500"
                                >
                                  <span>Change</span>
                                  <span className="sr-only"> user photo</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="relative hidden overflow-hidden rounded-full lg:block">
                            {userImage ? (
                              <img src={`${baseUrl}/uploads/${userImage}`} alt="User" className="h-40 w-40 rounded-full" />
                            ) : (
                              <img src={`${userImage}`} alt="User" className="h-14 w-14 rounded-full" />
                            )}
                            <label
                              htmlFor="desktop-user-photo"
                              className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-0 hover:opacity-100"
                            >
                              <span>Change</span>
                              <span className="sr-only"> user photo</span>
                              <input
                                type="file"
                                onChange={changeImage}
                                id="desktop-user-photo"
                                name="user-photo"
                                className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-12 gap-6">
                        <div className="col-span-12 sm:col-span-6">
                          <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                            First name
                          </label>
                          <div className="mt-2 flex rounded-md shadow-sm">
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                name="firstName"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={!!errors.firstName}
                                className="mt-1"
                                size="small"
                              />
                              {errors.firstName ? (
                                <div className="h-6 text-xs text-red-500">Error: {errors.firstName}</div>
                              ) : (<div className="h-6 text-xs "> </div>)}
                            </FormControl>
                          </div>
                        </div>

                        <div className="col-span-12 sm:col-span-6">
                          <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                            Last name
                          </label>
                          <div className="mt-2 flex rounded-md shadow-sm">
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                name="lastName"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={!!errors.lastName}
                                className="mt-1"
                                size="small"
                              />
                              {errors.lastName ? (
                                <div className="h-6 text-xs text-red-500">Error: {errors.lastName}</div>
                              ) : (<div className="h-6 text-xs "> </div>)}
                            </FormControl>
                          </div>
                        </div>

                        <div className="col-span-12 sm:col-span-6">
                          <label htmlFor="birthday" className="block text-sm font-medium leading-6 text-gray-900">
                            Birthday
                          </label>
                          <div className="mt-2 flex rounded-md shadow-sm">
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                name="birthday"
                                id="birthday"
                                type="date"
                                onChange={handleChange}
                                value={formData.birthday}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                className="mt-1"
                                size="small"
                              />
                            </FormControl>

                          </div>
                        </div>

                        <div className="col-span-12 sm:col-span-6">
                          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Current Password
                          </label>
                          <div className="mt-2 flex rounded-md shadow-sm">
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                className="mt-1"
                                size="small"
                              />
                              {errors.password ? (
                                <div className="h-6 text-xs text-red-500">Error: {errors.password}</div>
                              ) : (<div className="h-6 text-xs "> </div>)}
                            </FormControl>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* New password section */}
                    <div className=" pt-6 ">
                      <div className="px-4 sm:px-6">
                        <div>
                          <h2 className="text-lg font-medium leading-6 text-gray-900">Change Password</h2>
                          <button type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Click here to change your password
                          </button>



                        </div>
                      </div>
                      <div className="px-4 py-6 sm:p-6 lg:pb-8">

                        <div className="mt-6 grid grid-cols-12 gap-6">
                          <div className="col-span-12 sm:col-span-6">
                            <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-gray-900">
                              New Password
                            </label>
                            <div className="mt-2 flex rounded-md shadow-sm">
                              <FormControl fullWidth variant="outlined">
                                <TextField
                                  name="new-password"
                                  id="new-password"
                                  // value={formData.firstName}
                                  onChange={handleChange}
                                  // error={!!errors.firstName}
                                  className="mt-1"
                                  size="small"
                                />
                                {/* {errors.firstName ? (
                            <div className="h-6 text-xs text-red-500">Error: {errors.firstName}</div>
                          ) : (<div className="h-6 text-xs "> </div>)} */}
                              </FormControl>
                            </div>
                          </div>
                          <div className="col-span-12 sm:col-span-6">
                            <label htmlFor="confirm-new-password" className="block text-sm font-medium leading-6 text-gray-900">
                              Confirm New Password
                            </label>
                            <div className="mt-2 flex rounded-md shadow-sm">
                              <FormControl fullWidth variant="outlined">
                                <TextField
                                  name="confirm-new-password"
                                  id="confirm-new-password"
                                  // value={formData.firstName}
                                  onChange={handleChange}
                                  // error={!!errors.firstName}
                                  className="mt-1"
                                  size="small"
                                />
                                {/* {errors.firstName ? (
                            <div className="h-6 text-xs text-red-500">Error: {errors.firstName}</div>
                          ) : (<div className="h-6 text-xs "> </div>)} */}
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className="mt-4 flex justify-end gap-x-3 px-4 py-4 sm:px-6">
                        <div className="flex justify-end w-64">

                          <FormControl fullWidth variant="outlined">
                            <button
                              // type="submit"
                              onClick={onSubmit}
                              className='inline-flex items-center justify-center rounded-md border bg-indigo-600 hover:bg-indigo-700
                  px-8 py-3 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                            >
                              Save
                            </button>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </div>
                </ThemeProvider>

              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Settings;