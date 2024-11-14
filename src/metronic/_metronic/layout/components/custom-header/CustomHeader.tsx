import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { toAbsoluteUrl } from '@/metronic/_metronic/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faKey } from '@fortawesome/free-solid-svg-icons';
import cache from '@/core/cache';
import { LOCAL_USER_KEY } from '@/configs/auth.config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { mobileMenu } from '@/store/global/action';
import {  } from '@/modules/user/store/action';

import './CustomHeader.scss';

export const CustomHeader = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(store => store.auth);

  const logout = async () => {
    cache.remove(LOCAL_USER_KEY);
    navigate('/login');
  }

  const handleMobileMenu = () => {
    dispatch(mobileMenu());
  }

  return (
    <Fragment>
      <div className="custom-header-mobile">
        <div className="custom-header-mobile__logo">
          <a href="/">
            <img src={toAbsoluteUrl('/media/images/logo.png')} alt="" />
          </a>
        </div>

        <div className="custom-header-mobile__menu">
          <i onClick={handleMobileMenu} className="bi bi-list"></i>
        </div>
      </div>

      <div className="custom-header-content">
        <div className="custom-header-content__logo">
          <a href="/">
            <img src={toAbsoluteUrl('/media/images/logo.png')} alt="" />
          </a>
        </div>

        <div className="custom-header-content__toolbar">
          <span>Welcome {user ? user.userName : ''}</span>

          <FontAwesomeIcon icon={faAngleDown} />

          <ul>
            <li onClick={logout}>
              <a>
                <FontAwesomeIcon icon={faKey} />
                <span>Log Out</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
};