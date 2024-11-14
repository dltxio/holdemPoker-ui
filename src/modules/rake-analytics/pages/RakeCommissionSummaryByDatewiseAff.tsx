import React, { Fragment } from 'react';
import { Note } from '@/components/shared/note/Note';
import RakeCommissionSummaryByDatewise from './RakeCommissionSummaryByDatewise'
import { useAppSelector } from '@/store/hooks';

const Page = () => {
  const user = useAppSelector(s => s.auth.user)
  return (
    <RakeCommissionSummaryByDatewise
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
      description={
        <div className='fw-bold'>
          *Rake Generated : This amount is the total rake generated by all the players playing under that agent or affiliate and their sub-agents or sub-affiliate respectively, and in case of sub-agent or sub-affiliate, total rake generated by his players only.
          <br/>
          *Rake Commission : This amount is the rake commission earned by that agent,affiliate,sub-agent or sub-affiliate particularly.
        </div>
      }
      isAff
    />
  )
};

export default Page;