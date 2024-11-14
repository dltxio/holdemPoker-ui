import React, { Fragment } from 'react';
import clsx from 'clsx';

import './Card.scss';

type Props = {
  type?: 'primary' | 'danger' | 'info' | 'secondary' | 'warning';
  title?: any;
  detail?: string;
  icon?: string;
}

const Card: React.FC<Props> = ({
  type,
  title,
  detail,
  icon,
}) => {
  return (
    <Fragment>
      <div className={clsx(
        'card-content',
        { primary: type === undefined || !type },
        type,
      )}>
        <div className="visual">
          <i className={clsx('bi', icon)}></i>
        </div>

        <div className="details">
          <h3>{title}</h3>
          <h4>{detail}</h4>
        </div>
      </div>
    </Fragment>
  );
}

export { Card }
