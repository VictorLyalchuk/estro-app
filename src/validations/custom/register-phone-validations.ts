interface Errors {
    firstName: string;
    lastName: string;
    confirmPassword: string;
    phoneNumber: string;
    email: string;
    password: string;
    authType: string;
  }
  
  export const validatePhoneNumber = (
    value: string,
    currentErrors: Errors,
    setErrors: (errors: Errors) => void
  ) => {
    const isValidPrefix = /^(067|095|099|066|063|098|097|096|093)/.test(value.substr(0, 3));
    const isValidDigits = /^\d{7}$/.test(value.substr(3));
    const isValid = isValidPrefix && isValidDigits;
  
    setErrors({
      ...currentErrors,
      phoneNumber: isValid ? '' : 'Invalid phone number format',
    });
  };