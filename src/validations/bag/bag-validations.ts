interface FormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    payment: string;
}

interface Errors {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    city: string;
    warehouse: string;
}

export const validateForm = (formData: FormData, city: string, warehouse: string, selectedShipping: string, textmask: string): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        city: "",
        warehouse: "",
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

    if (city.trim() === '') {
        newErrors.city = 'City is required';
        isValid = false;
    }

    if (selectedShipping === 'Branch') {
        if (warehouse.trim() === '') {
            newErrors.warehouse = 'Warehouse is required';
            isValid = false;
        }
    }
    if (selectedShipping === 'Postomat') {
        if (warehouse.trim() === '') {
            newErrors.warehouse = 'Postomat is required';
            isValid = false;
        }
    }
    if (selectedShipping === 'Store') {
        if (warehouse.trim() === '') {
            newErrors.warehouse = 'Store is required';
            isValid = false;
        }
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


    return { isValid, newErrors };
};