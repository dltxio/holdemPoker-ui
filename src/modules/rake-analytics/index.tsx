import { RouteObject } from 'react-router';

// import { loadable } from '@/components/shared/Loadable';
import { routesWithLazy } from '@/helpers/routing';

// const Dashboard = loadable(() => import('./pages/Dashboard'));

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'rakeReportCommission',
      import: () => import('./pages/RakeCommissionReport')
    },
    {
      path: 'rakeReportAffiliate',
      import: () => import('./pages/RakeCommissionReportAffiliate')
    },
    {
      path: 'dailyRakeChart',
      import: () => import('./pages/DailyRakeCommissionChartForMonth')
    },
    {
      path: 'rakeByDate',
      import: () => import('./pages/RakeCommissionSummaryByDate')
    },
    {
      path: 'rakeByDateAffMod',
      import: () => import('./pages/RakeCommissionSummaryByDateAff')
    },
    {
      path: 'rakeByAffiliateOrPlayer',
      import: () => import('./pages/RakeCommissionSummaryByAgent')
    },
    {
      path: 'rakeByAffiliateOrPlayerAffMod',
      import: () => import('./pages/RakeCommissionSummaryByAgentAff')
    },
    {
      path: 'rakeByCashTable',
      import: () => import('./pages/RakeCommissionSummaryByCashTable')
    },
    {
      path: 'gameVariantsRakeReport',
      import: () => import('./pages/RakeCommissionSummaryByGameVariants')
    },
    {
      path: 'rakeByTimeOfDay',
      import: () => import('./pages/RakeCommissionChartByTimeOfDay')
    },
    {
      path: 'rakeDatewise',
      import: () => import('./pages/RakeCommissionSummaryByDatewise')
    },
    {
      path: 'rakeDatewiseAffMod',
      import: () => import('./pages/RakeCommissionSummaryByDatewiseAff')
    },
    {
      path: 'tableRakeReport',
      import: () => import('./pages/TableRakeCommissionReport')
    },
    {
      path: 'rakeBackMonthlyReport',
      import: () => import('./pages/MonthlyRakeReport')
    }
  ])
}