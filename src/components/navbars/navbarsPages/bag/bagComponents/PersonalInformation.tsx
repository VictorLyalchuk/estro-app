import { Theme, ThemeProvider } from '@material-ui/core/styles';
import TextFieldComponent from '../../../../../ui/label/TextFieldComponent';
import PhoneNumberComponent from '../../../../../ui/label/PhoneNumberComponent';

interface PersonalInformationProps {
    theme: Theme;
    formData: {
        firstName: string;
        lastName: string;
        email: string;
    };
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: {
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phoneNumber?: string | null;
    };
    activeBlock: string;
    handleBlockClick: (block: string) => void;
    changePhoneNumber: (event: React.ChangeEvent<HTMLInputElement>) => void;
    values: {
        textmask: string;
    };
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({
    theme,
    formData,
    handleChange,
    errors,
    activeBlock,
    handleBlockClick,
    changePhoneNumber,
    values
}) => {
    return (
        <div className="bg-white p-5 rounded-md shadow-md mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold mb-4 cursor-pointer" onClick={() => handleBlockClick('personal')}>Personal Information</h3>
          </div>
    
          <div className="border-t pt-4">
            {activeBlock === 'personal' && (
              <div className="">
    
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <ThemeProvider theme={theme}>
                  <TextFieldComponent
                    label=""
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName ?? null}
                    autoComplete="firstName"
                  />
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <TextFieldComponent
                    label=""
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName ?? null}
                    autoComplete="lastName"
                  />
    
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <TextFieldComponent
                    label=""
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email ?? null}
                    autoComplete="email"
                  />
    
                  <label htmlFor="textmask" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <PhoneNumberComponent
                    value={values.textmask}
                    label=""
                    id="textmask"
                    onChange={changePhoneNumber}
                    error={errors.phoneNumber ?? null}
                  />
                </ThemeProvider>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    export default PersonalInformation;