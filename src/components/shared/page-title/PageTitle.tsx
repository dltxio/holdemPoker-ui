import React, { Fragment } from 'react';
import clsx from 'clsx';

import './PageTitle.scss';

type Props = {
  text: string;
  mode?: 'light' | 'bold';
  type?: 'primary' | 'danger' | 'info' | 'secondary' | 'warning';
  icon?: string;
}

const PageTitle: React.FC<Props> = ({ text, mode, icon, type }) => {
  return (
    <Fragment>
      <div className={clsx(
        'page-title-content',
        { light: !mode || mode === undefined},
        mode,
        type
      )}>
        <h3>
          {icon && icon !== '' && (<i className={clsx('bi', icon)}></i>)}
          {text}
        </h3>
      </div>
    </Fragment>
  )
};

export { PageTitle };