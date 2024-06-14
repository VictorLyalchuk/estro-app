import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IUser } from './interfaces/Auth/IUser';
import { AuthReducerActionType } from './store/accounts/AuthReducer';
import { jwtDecode } from 'jwt-decode'

const useAuthTokenEffect = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleTokenChange = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const user = jwtDecode(token) as IUser;
        dispatch({
          type: AuthReducerActionType.LOGIN_USER,
          payload: {
            Id: user.Id,
            Email: user.Email,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Role: user.Role,
            ImagePath: user.ImagePath,
            PhoneNumber: user.PhoneNumber,
            AuthType: user.AuthType
          } as IUser
        });
      } else {
        dispatch({ type: AuthReducerActionType.LOGOUT_USER });
      }
    };

    window.addEventListener('storage', handleTokenChange);

    handleTokenChange();

    return () => {
      window.removeEventListener('storage', handleTokenChange);
    };
  }, [dispatch]);
};

export default useAuthTokenEffect;