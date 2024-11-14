import { Fragment } from 'react';
import clsx from 'clsx';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';

// import './BonusTransfer.scss';
import { useAppDispatch } from '@/store/hooks';
// import { getUsersAndCalculateBonus, saveInstantBonusTransfer } from '../store/action';
import { Checkbox, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { showAlert } from '@/store/global/action';
import { fixedDecimal } from '@/helpers/number';
import { unwrapResult } from '@reduxjs/toolkit';
// import { BonusChipsTypes, TransferTypes } from '../models/instantBonusHistory';
import { useBusyContext } from '@/components/shared/busy';
import { checkUserWithdrawlTransactionPullChips, pullChipsAffiliate, searchAffiliate, searchPlayer, pullChipsPlayerByAdmin } from '../store/action';


const transactionTypes = [
  {
    label: 'Real Chips',
    value: 'realChips'
  },
  {
    label: 'Rake Amount',
    value: 'rakeAmount'
  }
]

const Page = () => {
  const d = useAppDispatch();
  const bs = useBusyContext();
  const [form] = Form.useForm();
  const [user, setUser] = useState<any>({});
  const [data, setData] = useState<any>({});
  const [isShowUserData, setShowUserData] = useState(false)
  const handleOnSearch = async () => {
    if (data.userName) {
      const res = await d(searchPlayer({ userName: data.userName.value }));
      if (!res.payload) {
        d(showAlert({title: 'No such player found!!'}))
        return;
      }
      const player = res.payload;
      const playerData: any = {}
      playerData.realchips = fixedDecimal((player.realChips), 2);
      playerData.rakeamount = fixedDecimal(player.profit, 2);
      form.setFieldsValue({
        ...form.getFieldsValue(),
        ...playerData
      });
      setShowUserData(true);
      setUser(player);
      // $scope.showUserData = true;
    }
  }

  const handleSubmit = async ({amount, transactionType, userName}: any) => {
    const valid = await form.validateFields();
    if (!valid) return;
    bs.showBusy();
    try {
      unwrapResult(await d(checkUserWithdrawlTransactionPullChips({
        amount: Number(amount),
        // transactionType,
        userName,
        // role: user.role
      })));
      unwrapResult(await d(pullChipsPlayerByAdmin({
        amount: Number(amount),
        // transactionType,
        userName,
        // role: user.role
      })));
      form.resetFields();
      const msg = `Request Made Successfully`;
      d(showAlert({title: msg}));
    } catch (err: any) {
      d(showAlert({ title: err.message }));
    } finally {
      bs.hideBusy();
    }
  }

  const handleFieldsChange = (fields: any) => {
    data[fields[0].name[0]] = fields[0];
    setData({...data});
  }

  return (
    <Fragment>
      <div className="common-content">
        <Breadcrumb />

        <div className="common-content__wrapper">
          <Heading
            title="PULL CHIPS PLAYER"
            icon="bi-gear"
            type="info"
          />
          <div className="common-content__form mt-3">
            <Form
              form={form}
              labelCol={{
                md: 10
              }}
              onFinish={handleSubmit}
              onFieldsChange={handleFieldsChange}
            >
              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='userName'
                      className='mb-0'
                      label="UserName"
                      requiredMark='optional'
                      rules={[{ required: true, message: 'Please input user username!' }]}
                    >
                      <div className='form-item__multiple'>
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="UserName"
                        />
                        <Button
                          text="Search"
                          type="info"
                          rounded={false}
                          onClick={handleOnSearch}
                          icon="bi-search"
                          solid={true}
                        />
                      </div>
                    </Form.Item>
                  </div>
                </div>
              </div>

              {isShowUserData && <>
                <div className="form-item">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Item
                        name='realchips'
                        label='Real Chips'
                        className='mb-0'
                      >
                        <Input
                          type='number'
                          disabled
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                {/* <div className="form-item">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Item
                        name='rakeamount'
                        label='Rake Amount'
                        className='mb-0'
                      >
                        <Input
                          type='number'
                          disabled
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div> */}
              </>}

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='amount'
                      label='Number of Chips'
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'Number of Chips is required'},
                        {min: 1, message: 'Number of Chips cannot be less than 1.'}
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-buttons">
                <div className="row">
                  <div className="col-md-9 offset-md-3">
                    <button type="button" className="btn grey">Reset</button>
                    <button type="submit" className={clsx('btn', 'info')}>Submit</button>
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