import axios, { AxiosResponse } from "axios"
import { VisualPreferences } from "../scenes/global/Register"

export const simplePostRequest = async () => {
  const data = { message: 'Hello, server!' }

  fetch('http://localhost:5000/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error))
}

export const loginRequest = async (username: string, onLogin: () => void): Promise<string> => {
  await axios({
    method: 'GET',
    url: 'http://localhost:5000/login?username=' + username,
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
    const response = await axios.post('http://localhost:5000/register', {
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
    const response = await axios.get('http://localhost:5000/logout');
    if (response.status === 200) {
      console.log('Logout successful');
      window.location.assign('/');
    } else {
      console.log('Logout failed');
    }
  } catch (error) {
    console.log(error);
  }
};

export const getBasicGraphInfo = async () => {
  fetch('http://localhost:5000/graph')
    .then(response => response.json())
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
