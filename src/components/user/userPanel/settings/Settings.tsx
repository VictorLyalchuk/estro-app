import { useEffect, useState, Fragment, ChangeEvent } from 'react';
import { useDispatch } from "react-redux";
import { IUserEdit } from '../../../../interfaces/Auth/IUserEdit';
import moment from 'moment/moment';
import { IIUserImageEdit } from '../../../../interfaces/Auth/IIUserImageEdit';
import { FormControl, IconButton, Input, InputAdornment, TextField, ThemeProvider, createTheme } from '@material-ui/core';
import { beforeUpload, createUserImage, deleteUserImage, editUserImage } from '../../../../services/images/images-services';
import { APP_ENV } from '../../../../env/config';
import { editUserData, refreshRedux, refreshToken } from '../../../../services/accounts/account-services';
import { State } from '../../../../interfaces/Custom/Phone/State';
import TextMaskCustom from '../../../../services/custom/phone-services';
import { validateForm } from '../../../../validations/account/account-validations';
import { validatePhoneNumber } from '../../../../validations/custom/phone-validations';
import { SettingsUserProps } from '../../../../interfaces/Custom/Phone/ProfileUser/ProfileUserProps';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import Modal from '../../../cropImage/Modal';

const theme = createTheme({
  typography: {
    fontFamily: 'Satoshi, sans-serif',
  },
});

const Settings: React.FC<SettingsUserProps> = ({ userProfile }) => {
  const baseUrl = APP_ENV.BASE_URL;
  const dispatch = useDispatch();
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [userImage, setUserImage] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [open, setOpen] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [values, setValues] = useState<State>({
    textmask: '(   )    -  -  ',
  });

  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthday: '',
    password: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthday: '',
    password: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (userProfile) {
      const birthdayDate = moment(userProfile.birthday, 'YYYY-MM-DD').format('YYYY-MM-DD');
      setFormData({
        id: userProfile.id,
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phoneNumber || '',
        birthday: birthdayDate,
        password: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setValues((prevValues) => ({
        ...prevValues,
        textmask: userProfile.phoneNumber,
      }));
      setUserImage(userProfile.imagePath);
    }
  }, [userProfile]);

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setModalOpen(true);
    }
  };
  
  const changeImage = async (file: File) => {
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

  const changePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const currentPasswordToggle = () => {
    setShowCurrentPassword((prevShowPassword) => !prevShowPassword);
  };

  const newPasswordToggle = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const confirmNewPasswordToggle = () => {
    setShowConfirmNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const onSubmit = async () => {
    const { isValid, newErrors } = validateForm(formData, values.textmask, userProfile);
    setErrors(newErrors);
    if (isValid) {
      const model: IUserEdit = {
        id: formData.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        imagePath: userImage || "",
        phoneNumber: formData.phoneNumber,
        birthday: new Date(formData.birthday),
        password: formData.password,
        newPassword: formData.newPassword || '',
        confirmNewPassword: formData.confirmNewPassword || '',
      };
      await editUserData(model);
      await refreshToken();
      await refreshRedux(dispatch);
      setProfileUpdated(true);
      setOpen(true);
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
                            <label htmlFor="textmask" className="block text-sm font-medium leading-6 text-gray-900">
                              Phone
                            </label>
                            <div className="mt-2">
                              <FormControl fullWidth variant="outlined">
                                <Input
                                  name="textmask"
                                  id="textmask"
                                  value={values.textmask}
                                  onChange={changePhoneNumber}
                                  inputComponent={TextMaskCustom as any}
                                  error={!!errors.phoneNumber}
                                  className="mt-1"
                                  placeholder='(099) 00-00-000'
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
                                <img src={userImage ? `${baseUrl}/uploads/${userImage}` : `${baseUrl}/uploads/user404.webp`} alt="User" className="h-12 w-12 rounded-full" />
                              </div>
                              <div className="relative ml-5">
                                <input
                                  id="mobile-user-photo"
                                  // onChange={changeImage}
                                  name="user-photo"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
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
                            <img src={userImage ? `${baseUrl}/uploads/${userImage}` : `${baseUrl}/uploads/user404.webp`} alt="User" className="h-40 w-40 rounded-full" />
                            <label
                              htmlFor="desktop-user-photo"
                              className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-0 hover:opacity-100"
                            >
                              <span>Change</span>
                              <span className="sr-only"> user photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                // onChange={changeImage}
                                onChange={handleFileChange}
                                id="desktop-user-photo"
                                name="user-photo"
                                className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                              />
                            </label>
                          </div>

                          {modalOpen && selectedFile && (
                            <Modal
                              changeImage={changeImage}
                              closeModal={() => setModalOpen(false)}
                              file={selectedFile}
                            />
                          )}

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
                                type={showCurrentPassword ? 'text' : 'password'}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton onClick={currentPasswordToggle} edge="end">
                                        {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
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
                          <button onClick={() => { setUpdatePassword((prevState) => !prevState); }} type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Click here to change your password
                          </button>

                        </div>
                      </div>

                      {updatePassword && (
                        <div className="px-4 py-6 sm:p-6 lg:pb-8"  >
                          <div className="mt-6 grid grid-cols-12 gap-6">
                            <div className="col-span-12 sm:col-span-6">
                              <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                New Password
                              </label>
                              <div className="mt-2 flex rounded-md shadow-sm">
                                <FormControl fullWidth variant="outlined">
                                  <TextField
                                    name="newPassword"
                                    id="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    error={!!errors.confirmNewPassword}
                                    className="mt-1"
                                    size="small"
                                    type={showNewPassword ? 'text' : 'password'}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton onClick={newPasswordToggle} edge="end">
                                            {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                                          </IconButton>
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  {errors.confirmNewPassword ? (
                                    <div className="h-6 text-xs text-red-500">Error: {errors.confirmNewPassword}</div>
                                  ) : (<div className="h-6 text-xs "> </div>)}
                                </FormControl>
                              </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                              <label htmlFor="confirmNewPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                Confirm New Password
                              </label>
                              <div className="mt-2 flex rounded-md shadow-sm">
                                <FormControl fullWidth variant="outlined">
                                  <TextField
                                    name="confirmNewPassword"
                                    id="confirmNewPassword"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                    error={!!errors.confirmNewPassword}
                                    className="mt-1"
                                    size="small"
                                    type={showConfirmNewPassword ? 'text' : 'password'}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton onClick={confirmNewPasswordToggle} edge="end">
                                            {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                                          </IconButton>
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  {errors.confirmNewPassword ? (
                                    <div className="h-6 text-xs text-red-500">Error: {errors.confirmNewPassword}</div>
                                  ) : (<div className="h-6 text-xs "> </div>)}
                                </FormControl>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end gap-x-3 px-4 py-4 sm:px-6">
                        <div className="flex justify-end w-64">

                          <FormControl fullWidth variant="outlined">
                            <button
                              onClick={onSubmit}
                              className='inline-flex items-center justify-center rounded-md border bg-indigo-600 hover:bg-indigo-700
                  px-8 py-3 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                            >
                              Save
                            </button>
                            {profileUpdated && (
                              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96">
                                <Transition.Root show={open} as={Fragment}>
                                  <Dialog as="div" className="relative z-10" onClose={() => { setProfileUpdated(false) }}>
                                    <Transition.Child
                                      as={Fragment}
                                      enter="ease-out duration-300"
                                      enterFrom="opacity-0"
                                      enterTo="opacity-100"
                                      leave="ease-in duration-200"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                    </Transition.Child>

                                    <div className="fixed inset-0 z-10 overflow-y-auto">
                                      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <Transition.Child
                                          as={Fragment}
                                          enter="ease-out duration-300"
                                          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                          enterTo="opacity-100 translate-y-0 sm:scale-100"
                                          leave="ease-in duration-200"
                                          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        >
                                          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                            <div>
                                              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                              </div>
                                              <div className="mt-3 text-center sm:mt-5">
                                                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                  Success
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                  <p className="text-sm text-gray-500">
                                                    Profile updated successfully
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="mt-5 sm:mt-6">
                                              <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                onClick={() => setOpen(false)}
                                              >
                                                Go back to profile
                                              </button>
                                            </div>
                                          </Dialog.Panel>
                                        </Transition.Child>
                                      </div>
                                    </div>
                                  </Dialog>
                                </Transition.Root>
                              </div>
                            )}
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