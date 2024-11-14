import React, { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { getBreadcrums, getUniqueKey } from '@/helpers/common';
import { useAppSelector } from '@/store/hooks';

import './Breadcrumb.scss';
import { Button } from 'antd';

export type BreadcrumbProps = {
  customActions?: React.FC<any>;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ customActions: CustomActions }) => {
  const { pathname } = useLocation();

  const { modules } = useAppSelector(store => store.global);

  const [breadcurms, setBreadcurms] = useState<string[]>([]);
  
  useEffect(() => {
    if (modules && modules.length && pathname && pathname !== '') {
      const data = getBreadcrums(modules, pathname);
      setBreadcurms(data);
    }
  }, [pathname, modules]);
  
  return (
    <Fragment>
      <div
        className='d-flex align-items-center bg-white'
        style={{
          marginBottom: 20
        }}
      >
        <ol className="breadcrumb text-muted fs-6 fw-bold flex-fill">
          <li className="breadcrumb-item">
            <a href="/dashboard">
              <i className="bi bi-house-door-fill"></i>

              <span>Home</span>
            </a>

            <FontAwesomeIcon icon={faAngleRight} />
          </li>

          {breadcurms && breadcurms.length && breadcurms.map((item, index) => {
            if (index < breadcurms.length - 1) {
              return (
                <li className="breadcrumb-item text-muted" key={getUniqueKey()}>
                  <span>{item}</span>

                  <FontAwesomeIcon icon={faAngleRight} />
                </li>
              );
            }

            return (
              <li className="breadcrumb-item text-muted" key={getUniqueKey()}>
                <span>{item}</span>
              </li>
            );
          })}
        </ol>
        {CustomActions && 
          <div className='bg-white'>
            <CustomActions/>
          </div>
        }
      </div>
    </Fragment>
  )
}

export { Breadcrumb }