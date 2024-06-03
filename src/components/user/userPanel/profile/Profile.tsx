import axios from "axios";
import { IUserEdit } from "../../../../interfaces/Auth/IUserEdit";
import { APP_ENV } from "../../../../env/config";

interface UserProps {
  userEdit?: IUserEdit;
  countPage: number;
}

const formatDate = (date?: Date | string) => {
  if (!date) return 'N/A';
  const validDate = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(validDate.getTime())) return 'N/A';
  return validDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const Profile: React.FC<UserProps> = ({ userEdit, countPage }) => {
  const baseUrl = APP_ENV.BASE_URL;

  const emailConfirm = async () => {
    try {
      await axios.post(`${baseUrl}/api/AccountControllers/ConfirmMyEmail`, userEdit?.email, {
        headers: {
          "Content-Type": "application/json"
        }
      }).catch(error => {
        console.error('Error user data:', error);
      });
    }
    catch (error) {
      console.error("Email error:", error);
    }
  }

  return (
    <>
      <div className="bg-white rounded-md shadow-md mb-8 mt-8">
        <div className="mx-auto max-w-2xl px-8 py-8 sm:px-6 sm:pt-8 lg:max-w-7xl lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">First name</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userEdit?.firstName}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Last name</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userEdit?.lastName}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Birthday</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{formatDate(userEdit?.birthday)}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Orders</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{countPage}</div>
                  </dd>
                </div>

              </dl>
            </div>

            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Contact Information</h2>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userEdit?.email}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Phone</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userEdit?.phoneNumber}</div>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Security Information</h2>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email confirmed</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div style={{ color: userEdit?.emailConfirmed ? '#10b981' : '#ef4444' }}>
                      {userEdit?.emailConfirmed ? 'true' : 'false'}
                    </div>
                  </dd>
                </div>
                {!userEdit?.emailConfirmed &&
                  <div className="flex border-t border-gray-100 pt-6">
                    <button onClick={emailConfirm} type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                      Confirm your email
                    </button>
                  </div>
                }
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Phone confirmed</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div style={{ color: userEdit?.phoneNumberConfirmed ? '#10b981' : '#ef4444' }}>
                      {userEdit?.phoneNumberConfirmed ? 'true' : 'false'}
                    </div>
                  </dd>
                </div>
              {!userEdit?.phoneNumberConfirmed &&
                <div className="flex border-t border-gray-100 pt-6">
                  <button type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Confirm your phone
                  </button>
                </div>
              }
              </dl>
            </div>

            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Language and dates</h2>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Language</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">English</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Date format</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">DD-MM-YYYY</div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Profile;