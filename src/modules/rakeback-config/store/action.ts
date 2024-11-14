import HTTP, { wrapResponse } from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';

export const listRakeBack = createAppAsyncThunk('listRakeBack', () => {
    return HTTP.get(`listRakeBack`)
    .then(res => res.data.result);
});

export const editRakeback = createAppAsyncThunk('editRakeback', (data: any) => {
    return HTTP.post(`editRakeback`, data).then(res => res.data.result);
});