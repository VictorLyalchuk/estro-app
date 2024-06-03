import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from "../../utils/api/apiClient.ts";
import { handleAxiosError } from "../../utils/errors/handleAxiosError.ts";
import { ILogin } from '../../interfaces/Auth/ILogin.ts';
import { IRegister } from '../../interfaces/Auth/IRegister.ts';
import { IUserEdit } from '../../interfaces/Auth/IUserEdit.ts';
import { IRrefreshToken } from '../../interfaces/Auth/IRrefreshToken.ts';

export const login = createAsyncThunk(
    'account/login',
    async (payload: ILogin, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/AccountControllers/login', payload);
            return response.data;
        } catch (error) {
            return rejectWithValue(handleAxiosError(error, 'Сталася неочікувана помилка'));
        }
    },
);

export const register = createAsyncThunk(
    'account/register',
    async (payload: IRegister, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/AccountControllers/register', payload);
            return response.data;
        } catch (error) {
            return rejectWithValue(handleAxiosError(error, 'Error'));
        }
    },
);

export const updateUser = createAsyncThunk(
    'account/updateUser',
    async (payload: IUserEdit, { dispatch, rejectWithValue }) => {
        try {
            const response = await apiClient.put('/api/AccountControllers/update', payload);
            const newToken = response.data.token;
            // dispatch(refreshToken(newToken));
            return response.data;
        } catch (error) {
            return rejectWithValue(handleAxiosError(error, 'Error updating user data'));
        }
    }
);

export const refreshToken = createAsyncThunk(
    'AccountControllers/refreshToken',
    async (payload: IRrefreshToken, { rejectWithValue }) => {
        try {
            const response = await apiClient.put('/api/AccountControllers/refreshToken', payload);
            console.log(response);
            return response.data; // новий токен повертається у полі response.data.token
        } catch (error) {
            return rejectWithValue(handleAxiosError(error, 'Error updating user data'));
        }
    }
);