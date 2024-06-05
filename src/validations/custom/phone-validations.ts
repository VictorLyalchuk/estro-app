interface Errors {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthday: string;
    password: string;
    newPassword: string,
    confirmNewPassword: string,
  }
  
  export const validatePhoneNumber = (
    value: string,
    currentErrors: Errors,
    setErrors: (errors: Errors) => void
  ) => {
    const isValidPrefix = /^(067|095|099|066|063|098|097|096)/.test(value.substr(0, 3));
    const isValidDigits = /^\d{7}$/.test(value.substr(3));
    const isValid = isValidPrefix && isValidDigits;
  
    setErrors({
      ...currentErrors,
      phoneNumber: isValid ? '' : 'Invalid phone number format',
    });
  };