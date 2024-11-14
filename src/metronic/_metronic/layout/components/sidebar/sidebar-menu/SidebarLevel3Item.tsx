import React, { Fragment } from 'react';
import { SidebarMenuItem } from './SidebarMenuItem';
import { getMenuIcon, getUniqueKey } from '@/helpers/common';

type Props = {
  items?: any[];
}

const SidebarLevel3Item: React.FC<Props> = ({ items }) => {
  return (
    <Fragment>
      {items && items.length && items.map((item, index) => {
        if (item.status) {
          return (
            <SidebarMenuItem
              key={getUniqueKey()}
              to={item.route ? item.route : ''}
              title={item.name ? item.name : ''}
              fontIcon={getMenuIcon(item.iconClass)}
            />
          );
        }
      })}
    </Fragment>
  );
}

export { SidebarLevel3Item }