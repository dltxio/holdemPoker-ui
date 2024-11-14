import React, { Fragment } from 'react';
import clsx from 'clsx';

import './Ribbon.scss';

export type RibbonProps = {
  type?: 'primary' | 'danger' | 'info' | 'secondary' | 'warning';
  title?: any;
  content?: any;
  isExportPdf?: any
}

const Ribbon: React.FC<RibbonProps> = ({ type, title, content, isExportPdf }) => {
  // console.log("title: ", title);

  return (
    <Fragment>
      <div className={clsx(
        'ribbon-content',
        { primary: type === undefined || !type },
        type,
      )}>
        <div className="card card-bordered">
          <div className="card-header justify-content-end ribbon ribbon-start" style={{ whiteSpace: 'pre' }}>
            <div className="ribbon-label">{title}</div>
          </div>

          <div className="card-body">
            <p>{content}</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export { Ribbon }