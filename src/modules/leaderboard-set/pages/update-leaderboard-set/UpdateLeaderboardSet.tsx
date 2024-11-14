import { Fragment, useEffect, useState } from 'react';
import clsx from 'clsx';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';

import { Form, Input, Select } from 'antd';
import { createLeaderboardSet, getLeaderboardSets, getLeaderboardSpecificDetails } from '../../store/action';
import { useAppDispatch } from '@/store/hooks';
import { useLocation, useNavigate } from 'react-router';

import CreateLeaderboardSet from '../create-leaderboard-set/CreateLeaderboardSet'
import { useParams } from 'react-router';

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
    const res = await dispatch(getLeaderboardSets({
      leaderboardSetId: id
    }));
    if (res.payload.length > 0) {
      const set = res.payload[0];
      setData({
        leaderboardSetId: set.leaderboardSetId,
        leaderboardSetName: set.leaderboardSetName,
        leaderboardData: set.leaderboardList[0].leaderboardId
      })
    }
    setLoading(false)
  }

  const handleReset = () => nav(-1)

  if (loading) return (null);

  return (
    <CreateLeaderboardSet
      title="EDIT LEADERBOARD SETS"
      initialValues={data}
      isEdit={true}
      leaderboardSet={data}
      onReset={handleReset}
    />
  )
};

export default Page;