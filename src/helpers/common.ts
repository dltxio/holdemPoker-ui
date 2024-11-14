import { v4 as uuid } from 'uuid';
import { filter, map } from 'lodash';
import dayjs from '@/core/dayjs';
import cache from '@/core/cache';
import { LOCAL_USER_KEY } from '@/configs/auth.config';

// Interfaces
import { IRoleParam, IStorage, IStorageData } from '@/interfaces/global.interface';

// Constants
import { ROOT } from '@/constants';

export const getUniqueKey = () => {
  return uuid();
}

export const getRandomNumber = (max: number) => {
  return Math.floor(Math.random() * max) + 1;
}

export const setupMenu = (menu: any[]) => {
  const updatedMenu: any[] = [];

  if (menu && menu.length) {
    for (const lv1 of menu) {
      const level1 = { ...lv1, paths: [] };

      if (level1.route && level1.route !== '') {
        level1.paths.push(level1.route);
      }

      if (level1.subModule && level1.subModule.length) {
        for (let lv2 of level1.subModule) {
          const level2 = { ...lv2, paths: [] };

          if (level2.route && level2.route !== '') {
            level1.paths.push(level2.route);
            level2.paths.push(level2.route);
          }

          if (level2.subModule && level2.subModule.length) {
            for (let lv3 of level2.subModule) {
              const level3 = { ...lv3, paths: [] };

              if (level3.route && level3.route !== '') {
                level1.paths.push(level3.route);
                level2.paths.push(level3.route);
                level3.paths.push(level3.route);
              }

              lv3 = {...level3};
            }
          }

          lv2 = {...level2};
        }
      }

      updatedMenu.push(level1);
    }
  }

  return updatedMenu;
}

export const getBreadcrums = (menu: any[], route: string) => {
  const breadcurms: string[] = [];

  if (menu && menu.length && route && route !== '') {
    for (const level1 of menu) {
      if (level1.route && route.includes(level1.route)) {
        if (level1.name) {
          breadcurms.push(level1.name);
        }
        
        return breadcurms;
      }

      if (level1.subModule && level1.subModule.length) {
        for (const level2 of level1.subModule) {
          if (level2.route && route.includes(level2.route)) {
            if (level1.name) {
              breadcurms.push(level1.name);
            }

            if (level2.name) {
              breadcurms.push(level2.name);
            }

            return breadcurms;
          }

          if (level2.subModule && level2.subModule.length) {
            for (const level3 of level2.subModule) {
              if (level3.route && route.includes(level3.route)) {
                if (level1.name) {
                  breadcurms.push(level1.name);
                }

                if (level2.name) {
                  breadcurms.push(level2.name);
                }

                if (level3.name) {
                  breadcurms.push(level3.name);
                }

                return breadcurms;
              }
            }
          }
        }
      }
    }
  }

  return breadcurms;
}

export const formatTime = (miliseconds: number, format: string = 'DD-MM-YYYY HH:mm:ss') => {
  return dayjs(miliseconds).format(format);
}

export const getRoleParam = (value: number): IRoleParam | any => {
  if (ROOT && ROOT.employeeList && ROOT.employeeList.length) {
    const item = filter(ROOT.employeeList, { value });
    if (item && item.length) {
      return { name: item[0].label, level: value };
    }
  }

  return null;
}

export const getCurrentUserData = (): IStorageData | any => {
  const res: IStorage | any = cache.getCache(LOCAL_USER_KEY);
  return res?.data.token ? res.data : null;
}

export const toStringArray = (arr: any[]) => {
  return arr && arr.length ? map(arr, item => item.toString()) : arr;
}

export const getActiveModules = (modules: any[], codes: number[]) => {
  const newModules: any[] = [];
  if (modules && modules.length) {
    for (let item of modules) {
      const newItem = { ...item };
      if (codes.indexOf(item.code) === -1) {
        newItem.status = false;
      }
      if (item.code === 1006) {
        newItem.status = false;
      }

      if (newItem.subModule && newItem.subModule.length) {
        newItem.subModule = getActiveModules(newItem.subModule, codes);
      }

      newModules.push(newItem);
    }
  }
  return newModules;
}

export const getActiveModulesAdmin = (modules: any[], codes: number[]) => {
  const newModules: any[] = [];
  if (modules && modules.length) {
    for (let item of modules) {
      const newItem = { ...item };
      if (codes.indexOf(item.code) === -1) {
        newItem.status = false;
      }

      if (item.code === 2902) {
        newItem.status = true;
      }
      if (item.code === 2903) {
        newItem.status = true;
      }
      if (item.code === 4000) {
        newItem.status = true;
      }
      
      if (newItem.subModule && newItem.subModule.length) {
        newItem.subModule = getActiveModulesAdmin(newItem.subModule, codes);
      }
      
      newModules.push(newItem);
    }
  }
  return newModules;
}

export const getCheckedModules = (modules: any[], codes: number[]) => {
  const newModules: any[] = [];

  if (modules && modules.length) {
    for (let item of modules) {
      const newItem = { ...item };
      
      if (codes.indexOf(item.code) > -1) {
        newItem.status = false;
      }
      if (item.code === 1213) {
        newItem.status = true;
      }
      if (item.code === 1214) {
        newItem.status = true;
      } 
      // // cashout
      if (item.code === 1301) {
        newItem.status = true;
      }
      if (item.code === 1302) {
        newItem.status = true;
      }

      if (item.code === 2105) {
        newItem.status = false;
      }

      if (item.code === 2106) {
        newItem.status = false;
      }
      
      if (newItem.subModule && newItem.subModule.length) {
        newItem.subModule = getCheckedModules(newItem.subModule, codes);
      }
      
      newModules.push(newItem);
    }
  }
  
  return newModules;
}

export const getCheckedModulesAffAdmin = (modules: any[], codes: number[]) => {
  const newModules: any[] = [];

  if (modules && modules.length) {
    for (let item of modules) {
      const newItem = { ...item };
      
      if (codes.indexOf(item.code) > -1) {
        newItem.status = false;
      }
      // if (item.code === 1213) {
      //   newItem.status = true;
      // }
      // // cashout
      // if (item.code === 1301) {
      //   newItem.status = true;
      // }
      // if (item.code === 1302) {
      //   newItem.status = true;
      // }

      if (item.code === 1007) {
        newItem.status = false;
      }
      
      if (newItem.subModule && newItem.subModule.length) {
        newItem.subModule = getCheckedModulesAffAdmin(newItem.subModule, codes);
      }
      
      newModules.push(newItem);
    }
  }
  
  return newModules;
}

export const getCheckedModulesAff = (modules: any[], codes: number[]) => {
  const newModules: any[] = [];
  if (modules && modules.length) {
    for (let item of modules) {
      const newItem = { ...item };
      if (codes.indexOf(item.code) === -1) {
        newItem.status = false;
      }
      // chip management
      if (item.code === 1007) {
        newItem.status = false;
      }
      // user management
      if (item.code === 1208) {
        newItem.status = false;
      }
      if (item.code === 1209) {
        newItem.status = false;
      }
      // cashout dashboard
      // if (item.code === 1301) {
      //   newItem.status = false;
      // }
      if (item.code === 2106) {
        newItem.status = true;
      }
      if (item.code === 2107) {
        newItem.status = true;
      }
      if (item.code === 2108) {
        newItem.status = true;
      }
      if (item.code === 2109) {
        newItem.status = true;
      }
      if (item.code === 2005) {
        newItem.status = true;
      }

      if (newItem.subModule && newItem.subModule.length) {
        newItem.subModule = getCheckedModulesAff(newItem.subModule, codes);
      }
      
      newModules.push(newItem);
    }
  }
  return newModules;
}

export const getCheckedModulesNewAff = (modules: any[], codes: number[]) => {
  const newModules: any[] = [];

  if (modules && modules.length) {
    for (let item of modules) {
      const newItem = { ...item };
      
      if (codes.indexOf(item.code) > -1) {
        newItem.status = false;
      }
      if (item.code === 1213) {
        newItem.status = false;
      }
      if (item.code === 1214) {
        newItem.status = false;
      } 
      // // cashout
      // if (item.code === 1301) {
      //   newItem.status = true;
      // }
      // if (item.code === 1302) {
      //   newItem.status = true;
      // }

      if (item.code === 2105) {
        newItem.status = false;
      }
      
      if (newItem.subModule && newItem.subModule.length) {
        newItem.subModule = getCheckedModulesNewAff(newItem.subModule, codes);
      }
      
      newModules.push(newItem);
    }
  }
  
  return newModules;
}

export const getCheckedModulesDirect = (modules: any[], codes: number[]) => {
  // console.log("vao day khong");
  
  const newModules: any[] = [];

  if (modules && modules.length) {
    for (let item of modules) {
      const newItem = { ...item };
      
      if (codes.indexOf(item.code) > -1) {
        newItem.status = false;
      }
      if (item.code === 1213) {
        newItem.status = false;
      }
      if (item.code === 1214) {
        newItem.status = false;
      } 

      // chip managenent
      if (item.code === 1007) {
        console.log("========");
        
        newItem.status = false;
      }
      // // cashout
      // if (item.code === 1301) {
      //   newItem.status = true;
      // }
      // if (item.code === 1302) {
      //   newItem.status = true;
      // }

      if (item.code === 2105) {
        newItem.status = false;
      }
      
      if (newItem.subModule && newItem.subModule.length) {
        newItem.subModule = getCheckedModulesDirect(newItem.subModule, codes);
      }
      
      newModules.push(newItem);
    }
  }
  // console.log("newModules: ", newModules);
  
  return newModules;
}


export const checkAvailableParams = (fields: any[], values: any) => {
  if (fields && fields.length && values && Object.keys(values).length) {
    for (const field of fields) {
      if (values[field.name] !== undefined && values[field.name] !== null) {
        return true;
      }
    }
  }
  return false;
}

export const getMenuIcon = (iconClass: string) => {
  if (iconClass) {
    switch (iconClass) {
      case 'icon-home': {
        return 'bi-house-door';
      }
      case 'icon-settings': {
        return 'bi-gear';
      }
      case 'icon-puzzle': {
        return 'bi-puzzle';
      }
      case 'icon-badge': {
        return 'bi-award';
      }
    }
  }

  return iconClass;
}

export const isValidUser = (user: IStorageData) => {
  return user && user.token && user.userName ? true : false;
}

export const getAllCodes = (arr: any) => {
  let codes: number[] = [];
  const recursiveSearch = (subModules: any) => {
      for (let i = 0; i < subModules.length; i++) {
          codes.push(subModules[i].code);

          if (subModules[i].subModule && subModules[i].subModule.length > 0) {
              recursiveSearch(subModules[i].subModule);
          }
      }
  }
  recursiveSearch(arr);
  return codes;
}