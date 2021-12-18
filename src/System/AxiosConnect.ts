import https from 'https';
import axios, { AxiosInstance } from 'axios';


// для https соединения
const httpsAgent = new https.Agent({
	rejectUnauthorized: false, // (NOTE: this will disable client verification)
});

export const axiosConnect = axios.create({
    timeout: 20000,
    httpsAgent,
});


