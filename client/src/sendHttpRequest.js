/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080/api/v1';

async function sendHttpRequest(method, path, headers = {
  'Content-Type': 'application/json',
}, data = {}) {
  const url = `${BASE_URL}${path}`;
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    });

    return response.data;
  } catch (err) {
    if (err.response?.data.message) {
      localStorage.setItem('user_email', err.response.data?.data?.user?.email);
      throw new Error(err.response.data.message);
    } else {
      throw new Error('Something went wrong!');
    }
  }
}

export const followNewUserRequest = async (toBeFollows) => {
  const URL = `${BASE_URL}/user/follow/${toBeFollows}`;

  const cookie = Cookies.get('pl_user_session_token');

  try {
    const response = await axios({
      method: 'PUT',
      url: URL,
      data: {},
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': cookie,
      },
    });

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export default sendHttpRequest;
