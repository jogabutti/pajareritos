import axios, { AxiosResponse } from 'axios'

const EBIRD_API_KEY = process.env.REACT_APP_EBIRD_API_KEY || '';

export async function getMethod<T>(url: string, params?: object): Promise<T | null> {
  try {
    const response: AxiosResponse<T> = await axios.get(url, {
      params,
      headers: {
        'X-eBirdApiToken': EBIRD_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('GET error:', error);
    return null;
  }
}

export async function postMethod<T>(url: string, data?: object): Promise<T | null> {
  try {
    const response: AxiosResponse<T> = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error('POST error:', error);
    return null;
  }
}