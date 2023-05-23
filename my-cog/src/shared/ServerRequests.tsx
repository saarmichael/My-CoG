import axios, { AxiosResponse } from "axios"
import { VisualPreferences } from "../scenes/global/Register"
import { IVisGraphOption, IVisGraphOptionsContext, IVisSettings, VisGraphOptionsContext } from "../contexts/VisualGraphOptionsContext";

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
    .then(async () => {
      onLogin();
      return ('');
    })
    .catch(error => {
      console.log(error);
      return ('User Not Found');
    });
    return('');
};

export const registerRequest = async (username: string, data: string, settings: ServerSettings, onRegister: () => void) => {
  try {
    const response = await instance.post('/register', {
        username,
        data,
        settings
    });

    if (response.status === 200) {
        console.log('Registration successful');
        await loginRequest(username, onRegister);
        return 'Registration successful';
    } else {
        console.log('Registration failed');
        return 'Registration failed';
    }
    } catch (error) {
        console.log(error);
        return 'Username already exists';
    }
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

export interface ServerOption {
  label: string;
  checked: boolean;
}

export interface ServerSettings {
  options: ServerOption[];
  settings: IVisSettings;
}

export const extractOptions = (options: IVisGraphOption[]): ServerOption[] => {
  const serverOptions: ServerOption[] = [];
  options.forEach(option => {
    serverOptions.push({
      label: option.label,
      checked: option.checked,
    });
  });
  return serverOptions;
}


export const saveSettings = async (settings: VisualPreferences) => {
    const options = extractOptions(settings.options);
    const sets = settings.settings;
    const requestSettings: ServerSettings = {options: options, settings: sets}
    try {
      const response = await instance.post('/saveSettings', {
          requestSettings,
    });

    if (response.status === 200) {
        console.log('Settings saved successfully');
    }
    } catch (error) {
        console.error(error);
        console.log('Failed to save settings');
    }
};


export const getSettings = async (): Promise<ServerSettings> => {
    try {
        const response = await instance.get('/getSettings');
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
        console.log('Failed to get settings');
    }
    return {options: [], settings: {}};
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
