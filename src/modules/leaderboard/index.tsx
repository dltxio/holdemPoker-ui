import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'viewLeaderboard',
      import: () => import('./pages/list-leaderboard/ListLeaderboard')
    },
    {
      path: 'createLeaderboard',
      import: () => import('./pages/create-leaderboard/CreateLeaderboard')
    },
    {
      path: 'currentLeaderboardParticipants',
      import: () => import('./pages/current-leaderboard-participants/CurrentLeaderboardParticipants')
    },
    {
      path: 'directEntry',
      import: () => import('./pages/direct-leaderboard-entry/DirectLeaderboardEntry')
    },
    {
      path: 'directEntryHistory',
      import: () => import('./pages/direct-leaderboard-entry-history/DirectLeaderboardEntryHistory')
    },
    {
      path: 'leaderboard/edit/:id',
      import: () => import('./pages/update-leaderboard/UpdateLeaderboard')
    },
    {
      path: 'leaderboard/view/:id',
      import: () => import('./pages/view-leaderboard/ViewLeaderboard')
    },
    {
      path: 'leaderboard/duplicate/:id',
      import: () => import('./pages/duplicate-leaderboard/DuplicateLeaderboard')
    }
  ])
}