import React, { Fragment, useEffect, useState } from 'react';

// Components
import { PageTitle } from '@/components/shared/page-title/PageTitle';
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Card } from '@/components/shared/card/Card';
import { Note } from '@/components/shared/note/Note';

import './AccountDetail.scss';
import { getBalanceSheet } from '@/modules/account/store/action';
import { useAppDispatch } from '@/store/hooks';
import DisplayNumber from '@/components/shared/DisplayNumber';
import { formatNumberFields } from '@/helpers/number';

const Page = () => {
  const d = useAppDispatch();
  const [state, setState] = useState<any>({});
  const load = async () => {
    const res = await d(getBalanceSheet());
    setState(formatNumberFields(res.payload));
  }
  useEffect(() => {
    load();
  }, [])

  return (
    <Fragment>
      <div className="account-detail-content">
        <PageTitle text="Accounts" />

        <Breadcrumb />

        <div className="ccount-detail-content__static">
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <Card
                title={state?.bonus}
                detail={'Bonus Chips Generated'}
                type={'primary'}
                icon={'bi-chat'}
              />
            </div>

            <div className="col-md-3 col-sm-12">
              <Card
                title={state?.deposit}
                detail={'Total Chips'}
                type={'danger'}
                icon={'bi-bar-chart-fill'}
              />
            </div>

            <div className="col-md-3 col-sm-12">
              <Card
                title={state?.profit}
                detail={'Rake Earned'}
                type={'info'}
                icon={'bi-cart'}
              />
            </div>

            <div className="col-md-3 col-sm-12">
              <Card
                title={state?.withdrawal}
                detail={'Total Cashout'}
                type={'secondary'}
                icon={'bi-globe'}
              />
            </div>

            <div className="col-md-3 col-sm-12">
              <Card
                title={state?.instaCashBonus}
                detail={'Cash Bonus'}
                type={'danger'}
                icon={'bi-chat'}
              />
            </div>

            <div className="col-md-3 col-sm-12">
              <Card
                title={state?.instantChipsPulled}
                detail={'Instant Chips Pulled'}
                type={'info'}
                icon={'bi-chat'}
              />
            </div>
          </div>
        </div>

        <div className="account-detail-content__note">
          <Note content={'Bonus Data'} />
        </div>

        <div className="ccount-detail-content__static">
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <Card
                title={state?.instantBonusAmount}
                detail={'Instant Bonus Generated'}
                type={'danger'}
                icon={'bi-graph-up-arrow'}
              />
            </div>

            <div className="col-md-3 col-sm-12">
              <Card
                title={state?.instantBonusReleased}
                detail={'Instant Bonus Released'}
                type={'info'}
                icon={'bi-graph-up-arrow'}
              />
            </div>

            <div className="col-md-3 col-sm-12">
              <Card
                title={state?.lockedBonusAmount}
                detail={'Locked Bonus Generated'}
                type={'danger'}
                icon={'bi-globe'}
              />
            </div>

            <div className="col-md-3 col-sm-12">
              <Card
                title={state?.lockedBonusReleased}
                detail={'Locked Bonus Released'}
                type={'info'}
                icon={'bi-chat'}
              />
            </div>

            <div className="col-md-3 col-sm-12">
              <Card
                title={state?.leaderboardWinning}
                detail={'Leaderboard Winnings'}
                type={'secondary'}
                icon={'bi-graph-up-arrow'}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
};

export default Page;