import React, { Fragment } from 'react';
import clsx from 'clsx';
import { Button as AntdButton, ButtonProps } from 'antd';

import './Button.scss';
type Props = Omit<ButtonProps, 'type'> & {
  text?: string;
  type?: 'primary' | 'danger' | 'info' | 'secondary' | 'warning';
  rounded?: boolean;
  icon?: string;
  solid?: boolean;
  onClick?: () => void;
  btnType?: ButtonProps['type'],
  iconType?: 'bi' | 'fa',
  containerProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}

const Button: React.FC<Props> = ({ text, type, rounded, icon, iconType, solid, onClick, children, containerProps, ...props }) => {
  return (
    <Fragment>
      <div
        {...containerProps}
        className={`button-content${containerProps?.className && ' ' + containerProps.className || ''}`}
      >
        <AntdButton
          className={clsx(
            'default',
            { primary: type === undefined || !type },
            type,
            { rounded: rounded },
            { solid: solid }
          )}
          onClick={onClick}
          icon={icon ? <i className={clsx(iconType ? iconType : 'bi', icon)}></i> : null}
          {...props}
        >{text || children}</AntdButton>
      </div>
    </Fragment>
  );
}

export { Button }