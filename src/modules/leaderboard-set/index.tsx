import { RouteObject } from 'react-router';
import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'listLeaderboardCategory',
      import: () => import('./pages/list-leaderboard-set/ListLeaderboardSet')
    },
    {
      path: 'createLeaderboardCategory',
      import: () => import('./pages/create-leaderboard-set/CreateLeaderboardSet')
    },
    {
      path: 'leaderboardSet/edit/:id',
      import: () => import('./pages/update-leaderboard-set/UpdateLeaderboardSet')
    },
    {
      path: 'leaderboardSet/view/:id',
      import: () => import('./pages/view-leaderboard-set/ListLeaderboardSet')
    }
  ])
}