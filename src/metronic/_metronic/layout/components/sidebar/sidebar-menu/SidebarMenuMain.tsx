import { Fragment, useEffect, useState } from 'react';
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub';
import { SidebarMenuItem } from './SidebarMenuItem';
import { SidebarLevel2Item } from './SidebarLevel2Item';
import { getMenuIcon, getUniqueKey, setupMenu } from '@/helpers/common';
import { useAppSelector } from '@/store/hooks';

const SidebarMenuMain = () => {
  const [menu, setMenu] = useState<any[]>([]);

  const { modules } = useAppSelector(store => store.global);

  useEffect(() => {
    if (modules && modules.length) {
      const menuData = setupMenu(modules);
      setMenu([...[
        {
          name: 'Dashboard',
          iconClass: 'bi-house-door',
          status: true,
          route: '/dashboard',
        },
      ], ...menuData]);
    }
  }, [modules]);

  return (
    <Fragment>
      {menu && menu.length ? menu.map((item, index) => {
        if (item.status) {
          if (item.subModule && item.subModule.length) {
            return (
              <SidebarMenuItemWithSub
                key={getUniqueKey()}
                to=''
                paths={item.paths}
                title={item.name ? item.name : ''}
                fontIcon={getMenuIcon(item.iconClass)}
                hasArrow={true}
                fontIconType={item.iconType}
              >
                <SidebarLevel2Item items={item.subModule} />
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
      }) : null}
    </Fragment>
  )
}

export { SidebarMenuMain }
