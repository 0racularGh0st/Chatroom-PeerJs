import axios from 'axios';
import config from '../config';
export const createRoom = () => axios.get(`${config.SIGNALLING_SERVER}`);
