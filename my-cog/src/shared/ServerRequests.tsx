import axios from "axios"


export const simpleGetRequest = async () => {
    fetch('http://localhost:5000/')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error))
}
  
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

export const getCoherenceWindowRequest = async (start: string) => {
  const url = 'http://localhost:5000/time?start=' + parseFloat(start) + '&end=' + (parseFloat(start) + 20);
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      console.log(data);
      } catch (error) {
      console.error(error);
      }
};

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

export async function apiGET<T>(url: string): Promise<T> {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json() as Promise<T>;
    })
};


