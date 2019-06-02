import API from './index';
import ErrorObject from './ErrorObject';
import { BASE_URL, ENDPOINTS } from './config';

const api = new API({
  baseURL: `${BASE_URL}/rest-auth`,
  headers: {},
});

export async function login(email, password) {
  try {
    return await api.post(ENDPOINTS.LOGIN, {
      email, password
    });
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function registration(
  username, email, password1, password2,
) {
  try {
    return await api.post(ENDPOINTS.REGISTRATION, {
      username, email, password1, password2,
    });
  } catch (error) {
    return new ErrorObject(error);
  }
}
