import React, { Fragment } from 'react';
import { Progress } from 'antd';
import clsx from 'clsx';

import './CardProcess.scss';

type Props = {
  type?: 'primary' | 'danger' | 'info' | 'secondary' | 'warning';
  percent: number;
  title: string;
  data: Array<{
    label: string,
    value: number
  }>
}

const CardProcess: React.FC<Props> = ({ type, percent, data, title }) => {
  return (
    <Fragment>
      <div className={clsx(
        'card-process-content',
        { primary: type === undefined || !type },
        type,
      )}>
        {data.map((item, idx) => (
          <h3 key={`card-${idx}`}>
            <span>{item.value}</span>
            <span>({item.label})</span>
          </h3>
        ))}

        <h4>{title}</h4>

        <div className="card-process-content__process">
          <Progress className="default" percent={percent} />

          <div className="card-process-content__process__info">
            <span>Change</span>

            <span>{percent}%</span>
          </div>
        </div>

        <i className="bi bi-arrow-up"></i>
      </div>
    </Fragment>
  );
}

export { CardProcess }