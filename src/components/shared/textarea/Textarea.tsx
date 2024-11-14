import React, { Fragment } from 'react';
import { Input } from 'antd';
import clsx from 'clsx';

import './Textarea.scss';

type Props = {
  icon?: string;
  rows?: number;
  placeholder?: string;
  onChange(e: any): void;
}

const { TextArea } = Input;

const Textarea: React.FC<Props> = ({ icon, rows, placeholder, onChange }) => {
  const handleOnChange = (e: any) => {
    onChange(e);
  }

  return (
    <Fragment>
      <div className="textarea-content">
        {icon && icon !== '' && (
          <div className="textarea-content__icon">
            <i className={clsx('bi', icon)}></i>
          </div>
        )}

        <div className="textarea-content__input">
          <TextArea
            rows={rows ? rows : 4}
            onChange={handleOnChange}
            placeholder={placeholder ? placeholder : ''}
          />
        </div>
      </div>
    </Fragment>
  );
}

export { Textarea }