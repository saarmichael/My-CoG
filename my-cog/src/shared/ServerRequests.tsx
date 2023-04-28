import axios, { AxiosResponse } from "axios"




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

export const loginRequest = async (username: string, onLogin: () => void) => {
  axios({
    method: 'GET',
    url: 'http://localhost:5000/users?username=' + username,
  })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
};

export const logoutRequest = async () => {
  try {
    const response = await axios.post('http://localhost:5000/logout');
    if (response.status === 200) {
      console.log('Logout successful');
    } else {
      console.log('Logout failed');
    }
  } catch (error) {
    console.log(error);
  }
};

export const registerRequest = async (username: string, data: string, onRegister: () => void) => {
  try {
    const response = await axios.post('http://localhost:5000/users', {
      username,
      data,
    });

    if (response.status === 200) {
      console.log('Registration successful');
      loginRequest(username, onRegister);
    } else {
      console.log('Registration failed');
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
