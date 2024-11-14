import React, { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { getBreadcrums, getUniqueKey } from '@/helpers/common';
import { useAppSelector } from '@/store/hooks';

import './CustomBreadcrumb.scss';

export type BreadcrumbProps = {
  customActions?: React.FC<any>;
  modules: string[];
}


const CustomActions: React.FC<any> = ({ customActions: CustomActions }) => {
  return CustomActions &&
    <CustomActions />
}
const CustomBreadcrumb: React.FC<BreadcrumbProps> = ({ modules, customActions }) => {
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
          {modules && modules.length && modules.map((item, index) => {
            if (index < modules.length - 1) {
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
            <CustomActions customActions={customActions}/>
          </div>
        }
      </div>
    </Fragment>
  )
}

export { CustomBreadcrumb }