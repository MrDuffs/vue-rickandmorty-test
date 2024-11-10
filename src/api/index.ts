import axios from 'axios';

const apiURL = 'https://rickandmortyapi.com/api';

const api = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export {
  api,
};
