import { ProfileUserProps } from "../../../../interfaces/ProfileUser/ProfileUserProps";
import { emailConfirm } from "../../../../services/accounts/account-services";


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

const Profile: React.FC<ProfileUserProps> = ({ userProfile, countPage }) => {
  const confirm = async () => {
    if (userProfile) {
      emailConfirm(userProfile?.email);
    }
  }

  return (
    <>
      <div className="bg-white rounded-md shadow-md mb-8 mt-8">
        <div className="mx-auto max-w-2xl px-8 py-8 sm:px-6 sm:pt-8 lg:max-w-7xl lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div className="px-4 pt-6 sm:p-6 lg:pb-8">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
              <dl className="mt-6 space-y-6 divide-y divide-gray-200 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">First name</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userProfile?.firstName}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Last name</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userProfile?.lastName}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Birthday</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{formatDate(userProfile?.birthday)}</div>
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
            <div className="px-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Contact Information</h2>
              <dl className="mt-6 space-y-6 divide-y divide-gray-200 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userProfile?.email}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Phone</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userProfile?.phoneNumber}</div>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="px-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Security Information</h2>
              <dl className="mt-6 space-y-6 divide-y divide-gray-200 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Account status</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      {userProfile?.role}
                    </div>
                  </dd>
                </div>
                
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email confirmed</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div style={{ color: userProfile?.emailConfirmed ? '#10b981' : '#ef4444' }}>
                      {userProfile?.emailConfirmed ? 'true' : 'false'}
                    </div>
                  </dd>
                </div>
                {!userProfile?.emailConfirmed &&
                  <div className="flex border-t border-gray-100 pt-6">
                    <button onClick={confirm} type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                      Confirm your email
                    </button>
                  </div>
                }
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Phone confirmed</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div style={{ color: userProfile?.phoneNumberConfirmed ? '#10b981' : '#ef4444' }}>
                      {userProfile?.phoneNumberConfirmed ? 'true' : 'false'}
                    </div>
                  </dd>
                </div>
                {!userProfile?.phoneNumberConfirmed &&
                  <div className="flex border-t border-gray-100 pt-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                      Confirm your phone
                    </button>
                  </div>
                }
              </dl>
            </div>

            <div className="px-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Language and dates</h2>
              <dl className="mt-6 space-y-6 divide-y divide-gray-200 border-t border-gray-200 text-sm leading-6">
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