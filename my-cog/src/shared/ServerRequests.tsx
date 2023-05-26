import axios, { AxiosResponse } from "axios"
import { VisualPreferences } from "../scenes/global/Register"
import { IVisGraphOption, IVisGraphOptionsContext, IVisSettings, VisGraphOptionsContext } from "../contexts/VisualGraphOptionsContext";

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export const loginRequest = async (username: string, onLogin: () => void): Promise<string> => {
  try {
    await instance.get('/login', {
      params: {
        username: username,
      },
    });

    onLogin();
    return '';
  } catch (error) {
    console.log(error);
    return 'User Not Found';
  }
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
  const requestSettings: ServerSettings = { options: options, settings: sets }
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
  return { options: [], settings: {} };
};


/* 
  * This is a generic function for making GET requests to the server.
*/
export async function apiGET<T>(url: string, respType?: 'json' | 'blob'): Promise<T> {
  try {
    if(!respType) {
      respType = 'json';
    }
    const response = await instance.get(url, { responseType: respType });

    // if (response.headers['content-type']?.includes('image')) {
    //   // turn the response.data into an array buffer
    //   return response.data as T;
    // }

    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.statusText || 'Error occurred while fetching data');
    } else {
      throw error;
    }
  }
}

/* 
  * This is a generic function for making POST requests to the server.
*/
export async function apiPOST<T>(url: string, data: T): Promise<AxiosResponse<any, any>> {
  return instance({
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
