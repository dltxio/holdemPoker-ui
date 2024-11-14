import { RouteObject } from 'react-router';
import { loadable } from '@/components/shared/Loadable';

const AccountDetail = loadable(() => import('./pages/account-detail/AccountDetail'));
const BalanceSheet = loadable(() => import('./pages/balance-sheet/BalanceSheet'));

export const Router: RouteObject = {
  path: '',
  children: [
    {
      path: 'accountDetails',
      element: <AccountDetail />
    },
    {
      path: 'balanceSheet',
      element: <BalanceSheet />
    }
  ]
}