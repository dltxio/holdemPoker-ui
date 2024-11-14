import React, { Fragment } from 'react';
import { Note } from '@/components/shared/note/Note';
import RakeCommissionSummaryByDate from './RakeCommissionSummaryByDate'
import { useAppSelector } from '@/store/hooks';

const Page = () => {
  const user = useAppSelector(s => s.auth.user)
  return (
    <RakeCommissionSummaryByDate
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