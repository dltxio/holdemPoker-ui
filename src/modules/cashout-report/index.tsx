import { RouteObject } from 'react-router';

import { loadable } from '@/components/shared/Loadable';
import { routesWithLazy } from '@/helpers/routing';


export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'dailyCashoutDataReport',
      import: () => import('./pages/daily-cashout-report/DailyCashoutReport')
    },
    {
      path: 'monthlyCashoutDataReport',
      import: () => import('./pages/monthly-cashout/MonthlyCashout')
    },
    {
      path: 'dailyCashoutChart',
      import: () => import('./pages/daily-cashout-chart/DailyCashoutChart')
    },
  ])
}