import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'dailyChipsReport',
      import: () => import('./pages/daily-add-chips-report/DailyAddChipsReport')
    },
    {
      path: 'monthlyChipsReport',
      import: () => import('./pages/monthly-add-chips-report/MonthlyAddChipsReport')
    },
    {
      path: 'dailyChipsChart',
      import: () => import('./pages/daily-add-chips-chart/DailyAddChipsChart')
    },
    {
      path: 'monthlyBonusChipsReport',
      import: () => import('./pages/monthly-bonus-chips-report/MonthlyBonusChipsReport')
    }
  ])
}