import { RouteObject } from 'react-router';

import { loadable } from '@/components/shared/Loadable';

const SpamWords = loadable(() => import('./pages/spam-words/SpamWords'));

export const Router: RouteObject = {
  path: '',
  children: [
    {
      path: 'spamWords',
      element: <SpamWords />
    }
  ]
}