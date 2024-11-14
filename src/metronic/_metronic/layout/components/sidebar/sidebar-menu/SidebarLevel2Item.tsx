import React, { Fragment } from 'react';
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub';
import { SidebarLevel3Item } from './SidebarLevel3Item';
import { SidebarMenuItem } from './SidebarMenuItem';
import { getMenuIcon, getUniqueKey } from '@/helpers/common';

type Props = {
  items?: any[];
}

const SidebarLevel2Item: React.FC<Props> = ({ items }) => {
  return (
    <Fragment>
      {items && items.length && items.map((item, index) => {
        if (item.status) {
          if (item.subModule && item.subModule.length) {
            return (
              <SidebarMenuItemWithSub
                key={getUniqueKey()}
                to=''
                title={item.name ? item.name : ''}
                fontIcon={getMenuIcon(item.iconClass)}
                paths={item.paths}
              >
                <SidebarLevel3Item items={item.subModule} />
              </SidebarMenuItemWithSub>
            );
          }

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

export { SidebarLevel2Item }