import React, { Fragment } from 'react';
import clsx from 'clsx';

import './Heading.scss';

type Props = {
  type?: 'primary' | 'danger' | 'info' | 'secondary' | 'warning';
  title: string;
  icon?: string;
  solid?: boolean;
}

const Heading: React.FC<Props> = ({ type, title, icon, solid }) => {
  return (
    <Fragment>
      <div className={clsx(
        'heading-content',
        { primary: type === undefined || !type },
        type,
        { solid: solid },
        { hasIcon: icon && icon !== '' }
      )}>
        {icon && (<i className={clsx('bi', icon)}></i>)}

        <h3>{title}</h3>
      </div>
    </Fragment>
  );
}

export { Heading }