import React, { Fragment } from 'react';
import { Tag as AntdTag } from 'antd';

import './Tag.scss';

type Props = {

}

const tagsData = [
  {
    id: 1,
    label: 'test1',
  },
  {
    id: 2,
    label: 'test2',
  },
  {
    id: 3,
    label: 'test3',
  }
];

const Tag: React.FC<Props> = () => {
  return (
    <Fragment>
      <div className="tag-content">
        {tagsData.map((item, index) => (
          <AntdTag
            closable={true}
          >
            {item.label}
          </AntdTag>
        ))}
      </div>
    </Fragment>
  );
}

export { Tag }