import { Fragment } from 'react';
import clsx from 'clsx';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';

import './BonusTransfer.scss';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { getUsersAndCalculateBonus, saveInstantBonusTransfer } from '../../store/action';
import { Checkbox, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { showAlert } from '@/store/global/action';
import { fixedDecimal } from '@/helpers/number';
import TextArea from 'antd/lib/input/TextArea';
import { sleep } from '@/core/sleep';
import { useNavigate } from 'react-router';
import { unwrapResult } from '@reduxjs/toolkit';
import { BonusChipsTypes, TransferTypes } from '../../models/instantBonusHistory';
import { useBusyContext } from '@/components/shared/busy';

const Page = () => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const bs = useBusyContext();
  const [form] = Form.useForm();
  const [data, setData] = useState<any>({});
  const [isShowUserData, setShowUserData] = useState(false)
  const handleOnSearch = async () => {
    if (data.userName) {
      const res = await d(getUsersAndCalculateBonus({ userId: data.userName.value }));
      if (!res.payload) {
        d(showAlert({title: 'No such player found!!'}))
        return;
      }
      const player = res.payload[0];
      const playerData: any = {}
      playerData.totalChips = fixedDecimal((player.realChips + player.instantBonusAmount), 2);
      playerData.withdrawableChips = fixedDecimal(player.realChips, 2);
      playerData.instantBonusChips = fixedDecimal(player.instantBonusAmount, 2);
      playerData.lockedBonusChips = player.unclaimedBonusAmount;
      form.setFieldsValue({
        ...form.getFieldsValue(),
        ...playerData
      });
      setShowUserData(true);
      // $scope.showUserData = true;
    }
  }

  const handleSubmit = async (values: any) => {
    const valid = await form.validateFields();
    if (!valid) return;
    bs.showBusy();
    try {
      const data: any = {}
      data.bonusChipsType = values.bonusChipsType;
      data.lockedBonusAmount = (data.bonusChipsType === "instant") ? 0 : values.lockedBonusAmount;
      data.amount = (data.bonusChipsType === "locked") ? 0 : values.instantBonusAmount; 
      data.userName = values.userName; 
      data.transferType = values.transferType; 
      data.sendMail =  values.sendMail;
      data.mailText =  values.mailText;
      data.comments =  values.comments;
      unwrapResult(await d(saveInstantBonusTransfer(data)));
      const label = data.bonusChipsType === 'instantAndLocked' ? 'instant and locked' : data.bonusChipsType
      const msg = `Sucessfully transferred ${label} bonus to the player`;
      d(showAlert({title: msg}));
      await sleep(1000);
      nav('/instantBonusHistory');
    } catch (err: any) {
      d(showAlert({ title: err.message }));
    } finally {
      // hide loading
      bs.hideBusy();
    }
  }

  const handleFieldsChange = (fields: any) => {
    data[fields[0].name[0]] = fields[0];
    setData({...data});
  }

  const isLocked = data?.bonusChipsType?.value === 'locked' || data?.bonusChipsType?.value === 'instantAndLocked';
  const isInstant = data?.bonusChipsType?.value === 'instant' || data?.bonusChipsType?.value === 'instantAndLocked'

  return (
    <Fragment>
      <div className="bonus-transfer-content">
        <Breadcrumb />

        <div className="bonus-transfer-content__wrapper">
          <Heading
            title="Bonus Transfer"
            icon="bi-gear"
            type="info"
          />
          <div className="bonus-transfer-content__form mt-3">
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
                  {/* <div className="col-md-3">
                    <label className="form-item__label">Player User Name :</label>
                  </div> */}

                  <div className="col-md-6">
                    <Form.Item
                      name='userName'
                      className='mb-0'
                      label="Player User Name"
                      requiredMark='optional'
                      rules={[{ required: true, message: 'Please input user username!' }]}
                    >
                      <div className='form-item__multiple'>
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Player User Name"
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
                        name='totalChips'
                        label='Total Available Chips'
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
                <div className="form-item">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Item
                        name='withdrawableChips'
                        label='Withdrawable Chips'
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
                <div className="form-item">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Item
                        name='instantBonusChips'
                        label='Instant Bonus Amount'
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
                <div className="form-item">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Item
                        name='lockedBonusChips'
                        label='Locked Bonus Amount'
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
              </>}

              <div className="form-item">
                <div className="row">
                  {/* <div className="col-md-3">
                    <label className="form-item__label">Bonus Chips Type :</label>
                  </div> */}

                  <div className="col-md-6">
                    <Form.Item
                      name={'transferType'}
                      className='mb-0'
                      label='Transfer Type'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'Transfer Type is required'}
                      ]}
                    >
                      <Select
                        className='w-100'
                        options={TransferTypes}
                        placeholder='Please select'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  {/* <div className="col-md-3">
                    <label className="form-item__label">Transfer Type :</label>
                  </div> */}

                  <div className="col-md-6">
                    <Form.Item
                      label='Bonus Chips Type'
                      name={'bonusChipsType'}
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'Bonus Chips Type is required'}
                      ]}
                    >
                      <Select
                        className='w-100'
                        options={BonusChipsTypes}
                        placeholder='Please select'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              
              {isLocked && <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='lockedBonusAmount'
                      label='Locked Bonus Amount'
                      requiredMark={'optional'}
                      className='mb-0'
                      rules={[
                        {required: true, message: 'Locked bonus amount is required'},
                        {min: 1, message: 'Locked bonus amount cannot be less than 1.'}
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>}

              {isInstant && <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='instantBonusAmount'
                      label='Instant Bonus Amount'
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'Instant bonus amount is required'},
                        {min: 1, message: 'Instant bonus amount cannot be less than 1.'}
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>}

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='comments'
                      label='Comments'
                      className='mb-0'
                      requiredMark={'optional'}
                    >
                      <Input
                        type='text'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              {data.sendMail?.value && <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='mailText'
                      label='Mail Text'
                      className='mb-0'
                      requiredMark={'optional'}
                    >
                      <TextArea></TextArea>
                    </Form.Item>
                  </div>
                </div>
              </div>}

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='sendMail'
                      label='Send Mail To Player'
                      className='mb-0'
                      requiredMark={'optional'}
                      valuePropName="checked"
                    >
                      <Checkbox/>
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