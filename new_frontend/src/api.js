import axios from 'axios';

import { API_ENDPOINT } from './constants';

export const api = axios.create({
  baseURL: API_ENDPOINT,
  responseType: 'json',
});
