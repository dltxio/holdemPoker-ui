import { Fragment, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import clsx from 'clsx';
import { useAppDispatch } from '@/store/hooks';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import { PageTitle } from '@/components/shared/page-title/PageTitle';

// Helpers
import { formatTime } from '@/helpers/common';

// Actions
import { getPlayerDetail } from '../../store/action';

// Interfaces
import { IPlayerDetailParam } from '../../interfaces/CreatePlayer.interface';

import './ViewPlayer.scss';

const Page = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState<any>(null);

  const fetchData = async (id: string) => {
    try {
      const params: IPlayerDetailParam = {
        isOrganic: 'All',
        limit: 20,
        skip: 0,
        _id: id
      };
      const res: any = await dispatch(getPlayerDetail(params));
      setData(res.payload[0]);
    } catch (e) {
      console.log(e);
    }
  }

  const back = () => {
    nav('/listPlayer');
  }

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  return (
    <Fragment>
      <div className="create-player-content">
        <PageTitle
          text="View Player"
          mode="bold"
          type="danger"
          icon="bi-gear"
        />

        {data && (
          <div className="form">
            <Form
              layout="vertical"
              autoComplete="off"
              initialValues={{
                userName: data.userName,
                createdAt: formatTime(data.createdAt, 'DD-MM-YYYY hh:mm'),
                createdBy: data.createdBy,
                status: data.status,
                instantBonusAmount: data.displayInstantBonusAmount,
                realChips: data.displayRealChips,
                totalLeaderboardWinnings: data.totalLeaderboardWinnings,
                loyalityPoints: data.statistics.megaPoints.toFixed(2),
                claimedBonus: data.claimedBonus,
                unclaimedBonus: data.unclaimedBonus,
                // parent: data.displayParent,
                parent: data.isParentUserName ? (data.isParentUserName + "(" + data.parentType + ")") : (data.sponserId ? data.sponserId: "admin"),
                sponserId: data.sponserId,
              }}
            >
              <Form.Item
                label="Username"
                name="userName"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Created On"
                name="createdAt"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Created By"
                name="createdBy"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Total Available Chips"
                name="instantBonusAmount"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Total Withdrawable Chips"
                name="realChips"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Instant Bonus Amount"
                name="instantBonusAmount"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Total Leaderboard Winnings"
                name="totalLeaderboardWinnings"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Loyality Points"
                name="loyalityPoints"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Bonus(Claimed)"
                name="claimedBonus"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Bonus(Unclaimed)"
                name="unclaimedBonus"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Parent"
                name="parent"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="SponsorId"
                name="sponserId"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <div className="form-buttons">
                <div className="row">
                  <div className="offset-md-3 col-md-9 col-sm-12">
                    <Form.Item>
                      <button onClick={back} type="button" className={clsx('btn', 'primary')}>Back</button>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        )}
      </div>
    </Fragment>
  )
};

export default Page;