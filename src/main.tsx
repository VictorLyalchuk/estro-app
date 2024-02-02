import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './components/store/store.ts'
import { jwtDecode } from 'jwt-decode'
import { IUser } from './components/interfaces/Auth/IUser.ts'
import { AuthReducerActionType } from './components/auth/login/AuthReducer.ts'
import './index.css'
import './satoshi.css';


if(localStorage.token) {
  const user = jwtDecode(localStorage.token) as IUser;
  store.dispatch({
    type: AuthReducerActionType.LOGIN_USER,
    payload: {
      Id: user.Id,
      Email: user.Email,
      FirstName : user.FirstName,
      LastName : user.LastName,
      Role : user.Role,
      ImagePath: user.ImagePath,
    } as IUser
  });

}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
