import React, { Fragment, ReactElement, ReactNode } from 'react';
import { Navigate } from 'react-router';
import { LOCAL_USER_KEY } from '@/configs/auth.config';
import cache from '@/core/cache';

type Props = {
  children: ReactNode | ReactElement;
}

const PublicGuard: React.FC<Props> = ({ children }) => {
  const res: any = cache.getCache(LOCAL_USER_KEY);

  return (
    <Fragment>
      {res && res.data && res.data.token && res.data.isLogin === true || res?.data?.isAuthenticatorEnabled === "false" ? (
        <Navigate to='/dashboard' />
      ) : (
        <Fragment>{children}</Fragment>
      )}
    </Fragment>
  );
}

export { PublicGuard }