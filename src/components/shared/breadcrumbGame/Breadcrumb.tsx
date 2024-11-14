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
  console.log("pathname: ", pathname);

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

            {pathname.split("/")[2] === "viewUpdatesList" ?
                <li className="breadcrumb-item text-muted" key={getUniqueKey()}>
                    <span>Game Management <FontAwesomeIcon icon={faAngleRight} /> Table View & Creation <FontAwesomeIcon icon={faAngleRight} /> Updated history </span>
                </li> : pathname.split("/")[2] === "edit" ? <li className="breadcrumb-item text-muted" key={getUniqueKey()}>
                    <span>Game Management <FontAwesomeIcon icon={faAngleRight} /> Table View & Creation <FontAwesomeIcon icon={faAngleRight} /> Edit Table </span>
                </li> : pathname.split("/")[2] === "view" ? <li className="breadcrumb-item text-muted" key={getUniqueKey()}>
                    <span>Game Management <FontAwesomeIcon icon={faAngleRight} /> Table View & Creation <FontAwesomeIcon icon={faAngleRight} /> View Table </span>
                </li> : pathname.split("/")[2] === "duplicate" ? <li className="breadcrumb-item text-muted" key={getUniqueKey()}>
                    <span>Game Management <FontAwesomeIcon icon={faAngleRight} /> Table View & Creation <FontAwesomeIcon icon={faAngleRight} /> Duplicate Table </span>
                </li> : pathname.split("/")[2] === "viewUpdateRecord" ? <li className="breadcrumb-item text-muted" key={getUniqueKey()}>
                    <span>Game Management <FontAwesomeIcon icon={faAngleRight} /> Table View & Creation <FontAwesomeIcon icon={faAngleRight} /> View Changes </span>
                </li> : pathname.split("/")[1] === "createTable" ? <li className="breadcrumb-item text-muted" key={getUniqueKey()}>
                    <span>Game Management <FontAwesomeIcon icon={faAngleRight} /> Table View & Creation <FontAwesomeIcon icon={faAngleRight} /> Create Table </span>
                </li> : pathname.split("/")[1] === "findPlayerChartGamesPlayed" ? <li className="breadcrumb-item text-muted" key={getUniqueKey()}>
                    <span>Player Report Management <FontAwesomeIcon icon={faAngleRight} /> player report chart games played </span>
                </li> : "" }
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