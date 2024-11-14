import { createAction } from '@reduxjs/toolkit';
import { IAlertData, IEvent, IStorageData } from '@/interfaces/global.interface';
import { GLOBAL_EVENTS } from '@/constants';
import { createAppAsyncThunk } from '@/store/thunk';
import HTTP from '@/core/http';
import { getActiveModules, getAllCodes, getCheckedModulesAff, getCheckedModulesNewAff, getActiveModulesAdmin } from '@/helpers/common';
import { updateModuleAff } from '@/modules/user/store/action';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export const event = createAction<IEvent | any>('global/event');

export const emitEvent = (data: IEvent | any) => (dispatch: any) => {
  dispatch(event(data));
  setTimeout(() => {
    dispatch(event(null));
  }, 1000);
};

export const showAlert = (data: IAlertData, type?: 'success' | 'error') => (dispatch: any) => {
  if (type) {
    switch (type) {
      case 'success': {
        data.title = 'Success!';
        break;
      }
      case 'error': {
        data.title = 'Error!';
        break;
      }
    }
  }

  dispatch(event({ type: GLOBAL_EVENTS.SHOW_ALERT, data }));
  setTimeout(() => {
    dispatch(event(null));
  }, 1000);
};

export const mobileMenu = () => (dispatch: any) => {
  dispatch(event({ type: GLOBAL_EVENTS.MOBILE_MENU }));
  setTimeout(() => {
    dispatch(event(null));
  }, 1000);
}

export const listModules = createAppAsyncThunk('global/listModules', async (user: IStorageData) => {
  if (user) {
    const level = user.role?.level;
    const userRole = user.role?.name;
    
    if (level !== null && level !== undefined) {
      const url = userRole === "affiliate" ? 'getModuleListAff' : userRole === "subAffiliate" ? "getModuleListSubAff" : userRole === "newaffiliate" ? "getModuleListNewAff" : userRole === "newsubAffiliate" ? "getModuleListNewSupAff" : "getModuleList"
      return HTTP.post(url).then(res => {
        const modules = res.data.result ? res.data.result : [];
        // console.log("modules: ", modules);
        const accessModules = user.module?.map(item => Number(item)) || [];
        // console.log("accessModules: ", accessModules);
        
        if (accessModules && accessModules.length) {
          if (level > 0 && level < 7) {
            return getActiveModulesAdmin(modules, accessModules);
          } else {
            return getActiveModules(modules, accessModules);
          }
        }

        return modules;
      });
    }
  }
});

export const listAffModules = createAppAsyncThunk('global/listAffModules', (user: IStorageData) => {
  const level = user.role?.level;
  const userRole = user.role?.name;
  // console.log("userRole: ", userRole);
  const url = userRole === "affiliate" ? 'getModuleAff' : userRole === "subAffiliate" ? "getModuleAff" : "getModuleListAdmin"
  // console.log("url: ", url);
  return HTTP.post(url).then(async res => {
    const modules = res.data.result ? res.data.result : [];
    const codeAff: any = getAllCodes(modules);
    const findCodeAff = codeAff.filter((item: any) => item === 1007);
    // const dispatch = useAppDispatch();
    // await dispatch(updateModuleAff({
    //   userName: user.userName,
    //   module: findCodeAff.join()
    // }));
    const accessModules = user.module?.map(item => Number(item)) || [];
    if (accessModules && accessModules.length) {
      if (userRole !== "Director") {
        return getActiveModules(modules, accessModules);
      } else {
        return getCheckedModulesAff(modules, accessModules);
      }
    }
    return modules;
  });
});
