import axios, { AxiosError, AxiosResponse } from "axios"
import { VisualPreferences } from "../scenes/start/Register"
import { IVisGraphOption, IVisSettings } from "../contexts/VisualGraphOptionsContext";

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export const loginRequest = async (username: string, onLogin: () => void): Promise<string> => {
  try {
    const response = await instance.get('/login', {
      params: {
        username: username,
      },
    });

    if (response.status === 200) {
      onLogin();
      return response.data["user_data_dir"] as string;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      const message = axiosError.response.data as { message: string };
      return message["message"] as string;
    }
  }
  return 'Failed to login';
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
      return '';
    }
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      const message = axiosError.response.data as { message: string };
      return message["message"] as string;
    }
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
      return response;
    }).catch(error => {
      return error.response;
    });
}
