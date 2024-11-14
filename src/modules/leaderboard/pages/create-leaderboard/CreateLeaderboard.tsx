import { Fragment } from 'react';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { CreateLeaderboardForm } from './create-leaderboard-form/CreateLeaderboardForm';
import { Heading } from '@/components/shared/heading/Heading';

import './CreateLeaderboard.scss';
import { LeaderBoardActionEnum } from '../../models/Leaderboard';

const Page = () => {
  return (
    <Fragment>
      <div className="create-leaderboard-content">
        <Breadcrumb />

        <div className="create-leaderboard-content__wrapper">
          <Heading
            title="Create Leaderboard"
            icon="bi-award"
            type="info"
          />

          <CreateLeaderboardForm action={LeaderBoardActionEnum.create}/>
        </div>
      </div>
    </Fragment>
  )
};

export default Page;