import React, { Fragment } from 'react';
import clsx from 'clsx';

type Props = {
  fontIcon?: string;
  fontIconType?: string;
}

const Icon: React.FC<Props> = ({ fontIcon, fontIconType }) => {
  return (
    <Fragment>
      <i className={fontIconType ? fontIconType === 'fontawesome' ? clsx('far', fontIcon) : clsx('bi fs-3', fontIcon) : clsx('bi fs-3', fontIcon)}></i>
    </Fragment>
  )
}

export { Icon }