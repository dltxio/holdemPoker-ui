import { Fragment, useEffect, useState } from 'react';
import clsx from 'clsx';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';

import { Form, Input, Select } from 'antd';
import { useAppDispatch } from '@/store/hooks';
import { useLocation, useNavigate } from 'react-router';

import { useParams } from 'react-router';
import { CreateLeaderboardForm } from '../create-leaderboard/create-leaderboard-form/CreateLeaderboardForm';
import { listLeaderboard } from '../../store/action';
import { LeaderBoardActionEnum } from '../../models/Leaderboard';
import '../create-leaderboard/CreateLeaderboard.scss';
import dayjs from '@/core/dayjs';
import { CustomBreadcrumb } from '@/components/shared/customBreadcrumb/CustomBreadcrumb';
const Page = () => {
  const nav = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (params.id)
      getDetail(params.id)
  }, [params])

  const getDetail = async (id: string) => {
    const res = await dispatch(listLeaderboard({
      id
    }));
    if (res.payload.length > 0) {
      const leaderBoard = res.payload[0];
      let ranks: any = {};
      if (leaderBoard.payout) {
        for (let i = 0; i < leaderBoard?.payout?.length; i++) {
          ranks[`rank${i + 1}`] = leaderBoard.payout[i]
        }
      }
      let terms: any = {};

      if (leaderBoard.termsCondition) {
        for (let i = 0; i < leaderBoard?.termsCondition?.length; i++) {
          ranks[`TC${i + 1}`] = leaderBoard.termsCondition[i]
        }
      }

      setData({
        id,
        ...leaderBoard,
        ...ranks,
        ...terms,
        termsCondition: leaderBoard?.termsCondition?.length
      })
    }
    setLoading(false)
  }

  const handleReset = () => nav(-1)

  if (loading) return (null);

  return (
    <Fragment>
      <div className="create-leaderboard-content">
      <CustomBreadcrumb modules={['Leaderboard Management','List LeaderBoard','Duplicate LeaderBoard']}/>

        <div className="create-leaderboard-content__wrapper">
          <Heading
            title="Duplicate Leaderboard"
            icon="bi-award"
            type="info"
          />

          <CreateLeaderboardForm action={LeaderBoardActionEnum.duplicate} initialValues={data} />
        </div>
      </div>
    </Fragment>
  )
};

export default Page;