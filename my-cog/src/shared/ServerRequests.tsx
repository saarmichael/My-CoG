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

export const loginRequest = async (username: string, onLogin: () => void) => {
    try {
      const response = await axios.get('http://localhost:5000/users');

      if (response.status === 200) {
        console.log(response.data);
        onLogin();
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.log(error);
    }
};

export const registerRequest = async (username: string, auth_code: string, onRegister: () => void) => {
    try {
      const response = await axios.post('http://localhost:5000/users', {
        username,
        auth_code,
      });

      if (response.status === 200) {
        console.log('Registration successful');
      } else {
        console.log('Registration failed');
      }
      loginRequest(username, onRegister);
    } catch (error) {
        console.log(error);
    }
};