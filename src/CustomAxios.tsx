

import axios, { AxiosInstance } from 'axios';

// Define the proxy configuration
const proxyConfig = {
  host: 'localhost',
  port: 44338,
  protocol: 'https',
};

// Create a custom Axios instance with the proxy configuration
const customAxios: AxiosInstance = axios.create({
  proxy: proxyConfig,
});

export default customAxios;
