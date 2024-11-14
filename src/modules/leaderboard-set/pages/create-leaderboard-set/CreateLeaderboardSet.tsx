import { Fragment, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';

import './CreateLeaderboardSet.scss';
import { Form, FormInstance, Input, Select } from 'antd';
import { createLeaderboardSet, getLeaderboardSpecificDetails, updateLeaderboardSet } from '../../store/action';
import { useAppDispatch } from '@/store/hooks';
import { useNavigate } from 'react-router';

const Page = ({
  title = 'Create Leaderboard Sets',
  isEdit,
  leaderboardSet,
  initialValues,
  resetText = 'Reset',
  submitText = 'Submit',
  onReset,
}: any) => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const formRef = useRef<FormInstance>(null);
  const [leaderboards, setLeaderboards] = useState<any[]>([]);

  useEffect(() => {
    loadOptions();
  }, [])
  const handleSubmit = async (values: any) => {
    const sets = leaderboards
    .filter(x => values.leaderboardData.indexOf(x.value) > -1)
    .map(item => ({
      leaderboardName: item.label,
      leaderboardId: item.value,
      _id: item.id
    }));
    const data = {
      leaderboardArray: sets,
      leaderboardSetName: values.leaderboardSetName
    }
    if (isEdit) {
      await d(updateLeaderboardSet({
        ...data,
        leaderboardSetId: leaderboardSet.leaderboardSetId
      }))
    } else {
      await d(createLeaderboardSet(data));
    }
    nav('/listLeaderboardCategory')
  }

  const loadOptions = async () => {
    const res = await d(getLeaderboardSpecificDetails());
    setLeaderboards(res.payload.map((item: any) => ({
      label: item.leaderboardName,
      value: item.leaderboardId,
      id: item._id
    })))
  }

  const handleReset = () => {
    formRef.current?.resetFields();
    onReset && onReset(formRef.current);
  }

  return (
    <Fragment>
      <div className="create-leaderboard-set-content">
        <Breadcrumb />

        <div className="create-leaderboard-set-content__wrapper">
          <Heading
            title={title}
            icon="bi-award"
            type="info"
          />

          <div className="create-leaderboard-set-content__form mt-4">
            <Form
              ref={formRef}
              onFinish={handleSubmit}
              initialValues={initialValues}
              layout="horizontal"
              labelCol={{ span: 10 }}
            >
              <div className="form-item">
                <div className="row">
                  <div className="col-md-7">
                    <Form.Item
                      name='leaderboardSetName'
                      label='Leaderboard Set Name'
                      requiredMark="optional"
                      rules={[{ required: true, message: 'Leaderboard Set Name is required' }]}
                    >
                      <Input
                        placeholder='Leaderboard Set Name'                
                      />
                    </Form.Item>
                  </div>

                  <div className="col-md-7">
                    <Form.Item
                      name='leaderboardData'
                      label='Select Leaderboard'
                      requiredMark="optional"
                      rules={[{ required: true, message: 'Leaderboard is required' }]}
                    >
                      <Select
                        placeholder='Select Leaderboard'
                        options={leaderboards}
                        mode="multiple"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-buttons">
                <div className="row">
                  <div className="col-md-9 offset-md-3">
                    <button type="button" className="btn grey" onClick={handleReset}>{resetText}</button>
                    <button type="submit" className={clsx('btn', 'info')}>{submitText}</button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  )
};

export default Page;