import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'pullChipsAffiliate',
      import: () => import('./pages/PullChipsAffiliate')
    },
    {
      path: 'pullChipsPlayerByAdmin',
      import: () => import('./pages/PullChipsPlayer')
    },
    {
      path: 'pullChipsPlayerByAff',
      import: () => import('./pages/PullChipsPlayerByAff')
    },
    {
      path: 'pullInstantChipsPlayerByAdmin',
      import: () => import('./pages/PullInstantChipsPlayer')
    },
    {
      path: 'instantChipsPullHistory',
      import: () => import('./pages/InstantChipsPullHistory')
    }
  ])
}