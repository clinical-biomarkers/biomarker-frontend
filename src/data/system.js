import { getJson } from './api';

export const getSystemData = () => {
    const url = `/pages/detail/home_init`;

    return getJson(url);
}