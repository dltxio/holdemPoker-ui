import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  DrawerMessenger,
  ActivityDrawer,
  InviteUsers,
  UpgradePlan,
  ThemeModeProvider,
} from '@/metronic/_metronic/partials';
import { PageDataProvider } from '@/metronic/_metronic/layout/core';
import { reInitMenu } from '@/metronic/_metronic/helpers';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { listAffModules, listModules } from '@/store/global/action';

// Components
import { ScrollTop } from '@/metronic/_metronic/layout/components/scroll-top';
import { Content } from '@/metronic/_metronic/layout/components/content';
import { Sidebar } from '@/metronic/_metronic/layout/components/sidebar';
import { CustomHeader } from '@/metronic/_metronic/layout/components/custom-header';
import { Alert } from '@/components/shared/alert/Alert';

import '@/assets/styles/main.scss';

const MasterLayout = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(store => store.auth);

  useEffect(() => {
    reInitMenu()
  }, [location.key]);

  useEffect(() => {
    if (user) {
      dispatch(listModules(user));
      setTimeout(() => {
        dispatch(listAffModules(user));
      }, 1000)
    }
  }, [user]);

  return (
    <PageDataProvider>
      <ThemeModeProvider>
        <div className="custom-wrapper">
          <div className="custom-container">
            <CustomHeader />

            <div className="main-content">
              <Sidebar />

              <Content>
                <Outlet />
              </Content>
            </div>
          </div>
        </div>

        <ActivityDrawer />
        <DrawerMessenger />
        <InviteUsers />
        <UpgradePlan />
        <ScrollTop />
        <Alert />
      </ThemeModeProvider>
    </PageDataProvider>
  )
}

export { MasterLayout }
