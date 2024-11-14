import { RouteObject } from 'react-router';

import { loadable } from '@/components/shared/Loadable';

const ActivityDetails = loadable(() => import('./pages/activity-details/ActivityDetails'));

export const Router: RouteObject = {
  path: '',
  children: [
    {
      path: 'activityDetails',
      element: <ActivityDetails />
    }
  ]
}