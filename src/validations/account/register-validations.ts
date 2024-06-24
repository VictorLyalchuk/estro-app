interface FormData {
    firstName: string;
    lastName: string;
    confirmPassword: string;
    phoneNumber: string;
    email: string;
    password: string;
    authType: string;
}

interface Errors {
    firstName: string;
    lastName: string;
    confirmPassword: string;
    phoneNumber: string;
    email: string;
    password: string;
    authType: string;
}

export const validateForm = (formData: FormData, textmask: string): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
        firstName: "",
        lastName: "",
        confirmPassword: "",
        phoneNumber: "",
        email: "",
        password: "",
        authType: ""
    };

    if (formData.firstName.trim() === '') {
        newErrors.firstName = 'First Name is required';
        isValid = false;
    }

    if (formData.lastName.trim() === '') {
        newErrors.lastName = 'Last Name is required';
        isValid = false;
    }
    const cleanedPhoneNumber = textmask.replace(/\D/g, '');
    if (cleanedPhoneNumber.trim() === '') {
        newErrors.phoneNumber = 'Phone Number is required';
        isValid = false;
    }
    else if (!/^(067|095|099|066|063|098|097|096|093)\d{7}$/.test(cleanedPhoneNumber)) {
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

    return { isValid, newErrors };
};