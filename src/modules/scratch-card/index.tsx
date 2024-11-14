import { RouteObject } from 'react-router';
import { loadable } from '@/components/shared/Loadable';
import Approve from './pages/approve/Approve';

const GenerateCardAffiliate = loadable(() => import('./pages/generate-card-affiliate/GenerateCardAffiliate'));
const History = loadable(() => import('./pages/History'));
const HistoryAffilate = loadable(() => import('./pages/HistoryAffiliate'));
const Agent = loadable(() => import('./pages/Agent'));
const HighRollers = loadable(() => import('./pages/high-roller/HighRollers'));

export const Router: RouteObject = {
  path: '',
  children: [
    {
      path: 'generateCardAffiliate',
      element: <GenerateCardAffiliate />
    },
    // {
    //   path: 'generateCardPromotions',
    //   element: <Create/>
    // },
    {
      path: 'generateCardHighRollers',
      element: <HighRollers/>
    },
    {
      path: 'approveScratchCard',
      element: <Approve />
    },
    {
      path: 'scratchCardHistory',
      element: <History />
    },
    {
      path: 'scratchCardHistoryAffiliate',
      element: <HistoryAffilate/>
    },
  ]
}