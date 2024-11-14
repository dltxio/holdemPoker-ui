import React from 'react';
import clsx from 'clsx';
import { useLocation } from 'react-router';
import { useLayout } from '../../../core';
import { checkIsActive, checkIsIncluded } from '@/metronic/_metronic/helpers/RouterHelpers';
import { WithChildren } from '@/metronic/_metronic/helpers/react18MigrationHelpers';
import { KTSVG } from '@/metronic/_metronic/helpers/components/KTSVG';
import { Icon } from '@/components/shared/icon/Icon';

type Props = {
  to: string;
  title: string;
  icon?: string;
  fontIcon?: string;
  fontIconType?: string;
  hasBullet?: boolean;
  paths?: string[];
  hasArrow?: boolean;
}

const SidebarMenuItemWithSub: React.FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  fontIconType,
  hasBullet,
  paths,
  hasArrow,
}) => {
  const { pathname } = useLocation();
  const isActive = checkIsActive(pathname, to);
  const isIncluded = paths && paths.length ? checkIsIncluded(pathname, paths) : false;
  const { config } = useLayout();
  const { app } = config;

  return (
    <div
      className={clsx('menu-item', { 'here show': isActive }, { 'active-child': isIncluded }, 'menu-accordion')}
      data-kt-menu-trigger='click'
    >
      <span className={clsx('menu-link')}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}

        <div className="menu-link-wrapper">
          {icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
            <span className='menu-icon'>
              <KTSVG path={icon} className='svg-icon-2' />
            </span>
          )}
          {fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && (
            <Icon fontIcon={fontIcon} fontIconType={fontIconType} />
          )}
          <span className='menu-title'>{title}</span>
        </div>

        {hasArrow && (
          <span className='menu-arrow'></span>
        )}
      </span>

      <div className={clsx('menu-sub menu-sub-accordion', { 'menu-active-bg': isActive })}>
        {children}
      </div>
    </div>
  )
}

export { SidebarMenuItemWithSub }
