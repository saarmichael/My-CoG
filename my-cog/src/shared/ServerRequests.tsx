import axios, { AxiosResponse } from "axios"
import { VisualPreferences } from "../scenes/global/Register"

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export const simplePostRequest = async () => {
  const data = { message: 'Hello, server!' }

  instance.post('/data', data)
    .then(response => console.log(response.data))
    .catch(error => console.error(error))
}

export const loginRequest = async (username: string, onLogin: () => void): Promise<string> => {
  instance.get('/login', {
    params: {
      username: username,
    },
  })
    .then(response => {
      console.log(response.data);
      onLogin();
      return ('');
    })
    .catch(error => {
      console.log(error);
      return ('User Not Found');
    });
    return('');
};

export const registerRequest = async (username: string, data: string, settings: VisualPreferences, onRegister: () => void): Promise<string> => {
  console.log(settings)
  try {
    const response = await instance.post('/register', {
      username,
      data,
      settings,
    });

    if (response.status === 200) {
      console.log('Registration successful');
      loginRequest(username, onRegister);
      return ('');
    } else {
      console.log('Registration failed');
    }
  } catch (error) {
    console.log(error);
    return ('Username already exists');
  }
  return ('');
};

export const logoutRequest = async () => {
  try {
    const response = await instance.get('/logout');
    if (response.status === 200) {
      console.log(response.request);
      window.location.assign('/');
    } else {
      console.log('Logout failed');
    }
  } catch (error) {
    console.log(error);
  }
};

export const saveSettings = async (settings: VisualPreferences) => {
    try {
      const response = await instance.post('/saveSettings', {
          settings
    });

    if (response.status === 200) {
        console.log('Settings saved successfully');
    }
    } catch (error) {
        console.error(error);
        console.log('Failed to save settings');
    }
};

export const getBasicGraphInfo = async () => {
  instance.get('/graph')
    .then(response => response.data)
    .then(data => console.log(data))
    .catch(error => console.error(error))
};


/* 
  * This is a generic function for making GET requests to the server.
*/
export async function apiGET<T>(url: string): Promise<T> {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      if (response.headers.get("content-type")?.includes("image")) {
        return response.blob() as Promise<T>;
      }
      return response.json() as Promise<T>;
    })
};

/* 
  * This is a generic function for making POST requests to the server.
*/
export async function apiPOST<T>(url: string, data: T): Promise<AxiosResponse<any, any>> {
  return axios({
    method: 'POST',
    url: url,
    data: data,
  })
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.statusText)
      }
      return response;
    })
}
