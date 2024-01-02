import axios, { AxiosError, AxiosResponse } from 'axios';
import { ActivityFormValues, IActivity } from '../models/activity';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { IUser, IUserFormValues } from '../models/user';
import { IProfile, Profile } from '../models/profile';
import { IPhoto } from '../models/photo';
import { PaginatedResult } from '../models/pagination';

const sleep = (delay: number) => {
    return new Promise((resolve)=> {
        setTimeout(resolve, delay);
    });
}

console.log(import.meta.env.VITE_API_URL);
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if(token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axios.interceptors.response.use(async response => {
    if(import.meta.env.DEV) await sleep(1000);
    const pagination = response.headers['pagination'];
    if(pagination){
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
},(error: AxiosError) => {
    const {data, status, config} = error.response as AxiosResponse;
    switch (status){
        case 400:
            if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')){
                router.navigate('/not-found');
            }
            //toast.error('bad request');
            if (data.errors){
                const modelStateErrors = [];
                for (const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                throw modelStateErrors.flat();
            }
            else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 403:
            toast.error('forbidden');
            break;
        case 404:
            router.navigate('/not-found');
            toast.error('not found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            toast.error('server error');
    }
    return Promise.reject(error);
});

const request = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<IActivity[]>>('/activity', 
        {params}).then(responseBody),
    details: (id: string) => request.get<IActivity>(`/activity/${id}`),
    create: (activity: ActivityFormValues) => request.post<void>('/activity', activity),
    update: (activity: ActivityFormValues) => request.put<void>(`/activity/${activity.id}`, activity),
    delete: (id: string) => request.delete<void>(`/activity/${id}`),
    attend: (id: string) => request.post<void>(`activity/${id}/attend`, {})
}

const Account = {
    current: () => request.get<IUser>('/account'),
    login: (user: IUserFormValues) => request.post<IUser>('/account/login', user),
    register: (user: IUserFormValues) => request.post<IUser>('/account/register', user)
}

const Profiles = {
    get: (username: string) => request.get<Profile>(`/profiles/${username}`),
    upload: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<IPhoto>('photos', formData, {
            headers: {'Content-Type' : 'multipart/form-data'}
        })
    },
    setMainPhoto: (id: string) => request.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => request.delete(`/photos/${id}`),
    updateProfile: (profile: Partial<IProfile>) => request.put('/profiles', profile),
    updateFollowing: (username: string) => request.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => request
        .get<IProfile[]>(`/follow/${username}?predicate=${predicate}`)
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;