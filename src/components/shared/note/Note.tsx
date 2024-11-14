import React, { Fragment } from 'react';
import clsx from 'clsx';

import './Note.scss';

type Props = {
  content: string;
  subContent?: string;
  type?: 'primary' | 'danger' | 'info' | 'secondary' | 'warning';
}

const Note: React.FC<Props> = ({ content, type, subContent }) => {
  return (
    <Fragment>
      <div className={clsx(
        'alert',
        'd-flex',
        'align-items-center',
        'p-5',
        'mb-10',
        'w-10',
        { primary: type === undefined || !type },
        type,
      )}>
        <div className="d-flex flex-column">
          <h3>{content}</h3>

          {subContent && subContent !== '' && (
            <h3>{subContent}</h3>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export { Note }