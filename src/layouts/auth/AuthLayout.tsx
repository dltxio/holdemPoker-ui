import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { toAbsoluteUrl } from '@/metronic/_metronic/helpers';

// Components
import { Alert } from '@/components/shared/alert/Alert';

import './AuthLayout.scss';

const AuthLayout = () => {
  return (
    <Fragment>
      <div className="auth-layout">
        <div className="container">
          <div className="auth-layout__wrapper">
            <div className="auth-layout__content">
              <div className="auth-layout__content__logo">
                <a href="/">
                  <img src={toAbsoluteUrl('/media/images/logo.png')} alt="logo" />
                </a>
              </div>

              <Outlet />
            </div>
          </div>
        </div>
      </div>

      <Alert />
    </Fragment>
  );
}

export { AuthLayout };