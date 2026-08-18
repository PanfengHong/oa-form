import { request } from '@zdy-oa/utils';

export const getFormList = () => {
    return request.request({
        url: `/api/form/list`,
        method: 'GET'
    });
};

export const getFormDetail = (id: string) => {
    return request.request({
        url: `/api/form/detail/${id}`,
        method: 'GET'
    });
};

export const createForm = (data: any) => {
    return request.request({
        url: `/api/form/create`,
        method: 'POST',
        data
    });
};

export const updateForm = (id: string, data: any) => {
    return request.request({
        url: `/api/form/update/${id}`,
        method: 'PATCH',
        data
    });
};

export const deleteForm = (id: string) => {
    return request.request({
        url: `/api/form/delete/${id}`,
        method: 'DELETE'
    });
};