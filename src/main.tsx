import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
// import { jwtDecode } from 'jwt-decode'
// import { IUser } from './interfaces/Auth/IUser.ts'
// import { AuthReducerActionType } from './store/accounts/AuthReducer.ts'
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import './index.css'
import './satoshi.css';
// import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <GoogleOAuthProvider clientId="840790221401-5im429egocjlphps0jaonapq1j7jo1j8.apps.googleusercontent.com">
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  // </GoogleOAuthProvider>
)