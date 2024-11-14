import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'leaderboardReport',
      import: () => import('./pages/Report')
    },
    {
      path: 'leaderboardChart',
      import: () => import('./pages/chart/Chart')
    },
    {
      path: 'leaderboardReport/detail/:id',
      import: () => import('./pages/leaderboard-detail/LeaderboardDetail')
    }
  ])
}