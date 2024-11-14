import React, { Fragment } from 'react';
import { Note } from '@/components/shared/note/Note';
import { useAppSelector } from '@/store/hooks';
import RakeCommissionSummaryByAgent from './RakeCommissionSummaryByAgent';

const Page = () => {
  const user = useAppSelector(s => s.auth.user)
  return (
    <RakeCommissionSummaryByAgent
      userTypeOptions={[
        {
          label: 'Players',
          value: 'players'
        },
        {
          label: 'Sub-Agents/Sub-Affiliates',
          value: 'affiliates'
        },
        {
          label: 'Self',
          value: 'self'
        }
      ]}
      userNamePlaceHolder='Player ID /Sub-agent Id/Sub-Affiliate ID'
      isParentUserName={user?.userName}
      parentUser={user?.userName}
      isAff
    />
  )
};

export default Page;