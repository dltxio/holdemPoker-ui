import { createReducer } from '@reduxjs/toolkit';
import { event, listModules, listAffModules } from './action';
import { IEvent } from '@/interfaces/global.interface';

export interface IState {
  event: IEvent | any;
  modules: any[];
  affModules: any[];
}

const initialState: IState = {
  event: null,
  modules: [],
  affModules: [],
}

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(event, (state, action) => {
      state.event = action.payload;
    })
    .addCase(listModules.fulfilled, (state, action) => {
      if (action.payload) {
        state.modules = [...action.payload];
      }
    })
    .addCase(listAffModules.fulfilled, (state, action) => {
      if (action.payload) {
        state.affModules = [...action.payload];
      }
    })
});