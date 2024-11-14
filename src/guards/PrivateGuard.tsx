import React, { Fragment, ReactElement, ReactNode } from 'react';
import { Navigate } from 'react-router';
import { LOCAL_USER_KEY } from '@/configs/auth.config';
import cache from '@/core/cache';

type Props = {
  children: ReactNode | ReactElement;
}

const PrivateGuard: React.FC<Props> = ({ children }) => {
  const res: any = cache.getCache(LOCAL_USER_KEY);
  console.log("res=== ", res);

  return (
    <Fragment>
      {res && res?.data && res.data?.token && res?.data?.isLogin === true || res?.data?.isAuthenticatorEnabled === "false" ? (
        <Fragment>{children}</Fragment>
      ) : res && res?.data && res?.data?.token && res?.data?.isLogin === false || res?.data?.isAuthenticatorEnabled === "true" ? (
        <Navigate to='/googleAuthen' />
      ) : (
        <Navigate to='/login' />  
      )}
    </Fragment>
    // <Fragment>
    //   {res && res.data && res.data.token ? (
    //     <Fragment>{children}</Fragment>
    //   ) : (
    //     <Navigate to='/login' />
    //   )}
    // </Fragment>
  );
}

export { PrivateGuard }