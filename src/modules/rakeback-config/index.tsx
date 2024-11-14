import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'rakebackConfig',
      import: () => import('./pages/rakeback-config/RakebackConfig')
    },
  ])
}