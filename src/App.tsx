import { Provider } from 'react-redux';
import store from '@/store';
import { DefaultLoader as DefaultConfirmLoader } from '@/components/shared/confirmation/DefaultLoader';
import { DefaultLoader } from '@/components/shared/busy/DefaultLoader';
import Router from '@/routing';
import { BusyContextWrapper } from '@/components/shared/busy';
import { MetronicProvider } from '@/metronic';

import '@/App.css';
import 'antd/dist/antd.min.css';
import { ConfirmationContextWrapper } from './components/shared/confirmation';
import { ModalConfirmationLoader } from './components/shared/confirmation/ModalConfirmationLoader';
import HTTP from './core/http';
import { showAlert } from './store/global/action';
import { checkUserSessionInDb } from '@/modules/user/store/action';
import { LOCAL_USER_KEY } from "@/configs/auth.config";
import cache from "@/core/cache";
import { useState } from 'react';
import { getLocalUser } from "@/modules/auth/store/action";

HTTP.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status >= 400) {
      store.dispatch(showAlert({ title: err.message }))
    }
    throw err;
  }
)

function App () {
  const dispatch = store.dispatch;
  const roleUser: any = getLocalUser();
  
  setInterval(async () => {
    const res = cache.getCache(LOCAL_USER_KEY);
    if (res?.data?.token) {
      const uniqueSessionId =  res?.data?.uniqueSessionId;
      const userName = res?.data?.userName;
  
      const resData: any = await dispatch(checkUserSessionInDb({ uniqueSessionId, userName }));
      if (!resData.payload.status) {
        //
      } else {
        cache.remove(LOCAL_USER_KEY);
        dispatch(showAlert({ title: "error", content: "You have logged in from another device." }));
        setTimeout(() => {
          window.location.replace("/login")
        }, 1000)
        // setIsSameLogin(false)  
      }
    }
    
  }, 3000);
  
  return (
    <div className="App">
      <Provider
        store={store}
      >
        <MetronicProvider>
          <BusyContextWrapper>
            <ConfirmationContextWrapper>
            <DefaultLoader/>
            <ModalConfirmationLoader/>
              <Router role={roleUser?.data?.role?.level || 2}/>
            </ConfirmationContextWrapper>
          </BusyContextWrapper>
        </MetronicProvider>
      </Provider>
    </div>
  );
}

export default App;
