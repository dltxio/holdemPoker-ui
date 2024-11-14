import React, { Fragment, useEffect, useState } from 'react';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { PageTitle } from '@/components/shared/page-title/PageTitle';
import { CardProcess } from '@/components/shared/card-process/CardProcess';
import { Card } from '@/components/shared/card/Card';

import './ActivityDetails.scss';
import { useAppDispatch } from '@/store/hooks';
import { getActivityDetails } from '../../store/action';

const _cards = [
  {
    title: 'RAKE TODAY VS. RAKE YESTERDAY',
    percent: 'percentRakeProfitToday',
    data: [
      {
        label: 'TODAY',
        value: 'partialRakeToday'
      },
      {
        label: 'YESTERDAY',
        value: 'partialRakeYesterday'
      }
    ]
  },
  {
    title: 'RAKE THIS WEEK VS. RAKE LAST WEEK',
    percent: 'percentRakeProfitThisWeek',
    data: [
      {
        label: 'THIS WEEK',
        value: 'partialRakeThisWeek'
      },
      {
        label: 'LAST WEEK',
        value: 'totalRakeLastWeek'
      }
    ]
  },
  {
    title: 'CHIPS TODAY VS. CHIPS YESTERDAY',
    percent: 'percentChipsProfitToday',
    data: [
      {
        label: 'TODAY',
        value: 'totalChipsPartialToday'
      },
      {
        label: 'YESTERDAY',
        value: 'totalChipsYesterday'
      }
    ]
  },
  {
    title: 'CHIPS THIS WEEK VS. CHIPS LAST WEEK',
    percent: 'percentChipsProfitThisWeek',
    data: [
      {
        label: 'THIS WEEK',
        value: 'totalChipsPartialThisWeek'
      },
      {
        label: 'LAST WEEK',
        value: 'totalChipsLastWeek'
      }
    ]
  },
  {
    title: 'PLAYERS LOGGED IN TODAY VS. PLAYERS LOGGED IN YESTERDAY',
    percent: 'percentPlayersJoinToday',
    data: [
      {
        label: 'TODAY',
        value: 'totalPlayersLoggedInToday'
      },
      {
        label: 'YESTERDAY',
        value: 'totalPlayersLoggedInYesterday'
      }
    ]
  }
]

const renderCardProcess = (card: any, idx: number) => (
  <div key={`card-${idx}`} className="col-md-6 col-sm-12">
    <CardProcess
      type="info"
      percent={card.percent}
      title={card.title}
      data={card.data}
    />
  </div>
)

const Page = () => {
  const d = useAppDispatch();
  const [data, setData] = useState<any>({})
  const [cards, setCards] = useState(_cards);
  const setCardData = (data: any = {}) => {
    setCards(cards.map(item => ({
      ...item,
      percent: data[item.percent] || 0,
      data: item.data.map(itemdata => ({
        ...itemdata,
        value: data[itemdata.value] || 0
      }))
    })))
  };
  const load = async () => {
    const res = await d(getActivityDetails({}));
    // console.log(res);
    setCardData(res.payload);
    setData(res.payload);
  }
  useEffect(() => {
    load();
    setCardData({});
  }, [])
  return (
    <Fragment>
      <div className="activity-details-content">
        <PageTitle text="Activity" />

        <Breadcrumb />

        <div className="row">
          {cards.map(renderCardProcess)}
        </div>

        <div className="row">
          <div className="col-md-3 col-sm-12">
            <Card
              title={data.newPlayersToday || 0}
              detail={'Players Joined Today'}
              type={'primary'}
              icon={'bi-chat'}
            />
          </div>

          <div className="col-md-3 col-sm-12">
            <Card
              title={data.newPlayersThisMonth || 0}
              detail={'Players Joined This Month'}
              type={'danger'}
              icon={'bi-bar-chart-fill'}
            />
          </div>

          <div className="col-md-3 col-sm-12">
            <Card
              title={data.newPlayersThisYear || 0}
              detail={'Players Joined This Year'}
              type={'info'}
              icon={'bi-cart'}
            />
          </div>

          <div className="col-md-3 col-sm-12">
            <Card
              title={data.totalPlayersAllTime || 0}
              detail={'Players Joined All Time'}
              type={'secondary'}
              icon={'bi-globe'}
            />
          </div>

          <div className="col-md-3 col-sm-12">
            <Card
              title={data.onlinePlayers || 0}
              detail={'Online Players'}
              type={'primary'}
              icon={'bi-chat'}
            />
          </div>

          <div className="col-md-3 col-sm-12">
            <Card
              title={data.averageRakeThisWeek || 0}
              detail={'Avg. Rake/Day(This week)'}
              type={'danger'}
              icon={'bi-bar-chart-fill'}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
};

export default Page;