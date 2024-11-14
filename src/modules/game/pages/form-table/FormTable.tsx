import { Fragment } from 'react';
import clsx from 'clsx';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumbGame/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';

import './FormTable.scss';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
// import { getUsersAndCalculateBonus, saveInstantBonusTransfer } from '../../store/action';
import { Checkbox, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { showAlert } from '@/store/global/action';
import { fixedDecimal } from '@/helpers/number';
import TextArea from 'antd/lib/input/TextArea';
import { sleep } from '@/core/sleep';
import { useNavigate } from 'react-router';
import { unwrapResult } from '@reduxjs/toolkit';
// import { BonusChipsTypes, TransferTypes } from '../../models/instantBonusHistory';
import { useBusyContext } from '@/components/shared/busy';
import { GameVariations, StakesOptions, TableChipsTypes, TurnTimeOptions } from '../../models/Table';

export type EditTablePageProps = {
  title?: string;
  table?: any,
  onSubmit?: (table: any) => Promise<any>,
  viewOnly?: boolean
}

const Page = ({
  table,
  title = 'Edit Table',
  viewOnly,
  onSubmit
}: EditTablePageProps) => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const bs = useBusyContext();
  const [form] = Form.useForm();
  const [data, setData] = useState<any>({});
  const [isShowUserData, setShowUserData] = useState(false)

  useEffect(() => {
    form.setFieldsValue({
      ...table
    });
  }, [table]);

  const handleSubmit = async (values: any) => {
    const valid = await form.validateFields();
    if (!valid) return;
    bs.showBusy();
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
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

  return (
    <Fragment>
      <div className="bonus-transfer-content">
        <Breadcrumb />

        <div className="bonus-transfer-content__wrapper">
          <Heading
            title={title}
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
              disabled={viewOnly}
            >
              <div className="form-item">
                <div className="row">
                  {/* <div className="col-md-3">
                    <label className="form-item__label">Player User Name :</label>
                  </div> */}

                  <div className="col-md-6">
                    <Form.Item
                      name='channelName'
                      className='mb-0'
                      label="Table Name"
                      requiredMark='optional'
                      rules={[{ required: true, message: 'Please input table name!' }]}
                    >
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Table Name"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name={'channelVariation'}
                      className='mb-0'
                      label='Game Variation'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'Game Variation is required'}
                      ]}
                    >
                      <Select
                        className='w-100'
                        options={GameVariations}
                        placeholder='Please select'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      label='Chips Type'
                      name={'isRealMoney'}
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'Chips Type is required'}
                      ]}
                    >
                      <Select
                        className='w-100'
                        options={TableChipsTypes}
                        placeholder='Please select'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      label='Stakes'
                      name={'isPotLimit'}
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'Stakes is required'}
                      ]}
                    >
                      <Select
                        className='w-100'
                        options={StakesOptions}
                        placeholder='Please select'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              
              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='smallBlind'
                      label='Small Blind'
                      requiredMark={'optional'}
                      className='mb-0'
                      rules={[
                        {required: true, message: 'Small Blind is required'},
                        // {min: 1, message: 'Small Blind cannot be less than 1.'}
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value >= 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Small Blind cannot be negative'));
                          },
                        }),
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='bigBlind'
                      label='Big Blind'
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'Big Blind is required'},
                        // {min: 1, message: 'Big Blind cannot be less than 1.'}
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value >= 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Big Blind cannot be negative'));
                          },
                        }),
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name={['rake', 'rakePercentTwo']}
                      label='Rake (%) 2 Player'
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'This field is required'},
                        // {min: 1, message: 'Big Blind cannot be less than 1.'}
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value >= 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Rake (%) 2 Player cannot be negative'));
                          },
                        }),
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name={['rake', 'rakePercentThreeFour']}
                      label='Rake (%) 3-4 Player'
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'This field is required'},
                        // {min: 1, message: 'Big Blind cannot be less than 1.'}
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value >= 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Rake (%) 3-4 Player cannot be negative'));
                          },
                        }),
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name={['rake', 'rakePercentMoreThanFive']}
                      label='Rake (%) 5+ Player'
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'This field is required'},
                        // {min: 1, message: 'Big Blind cannot be less than 1.'}
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value >= 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Rake (%) 5+ Player cannot be negative'));
                          },
                        }),
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name={['rake', 'capTwo']}
                      label='Cap 2 players'
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'This field is required'},
                        // {min: 1, message: 'Big Blind cannot be less than 1.'}
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value >= 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Cap 2 players cannot be negative'));
                          },
                        }),
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name={['rake', 'capThreeFour']}
                      label='Cap 3-4 players'
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'This field is required'},
                        // {min: 1, message: 'Big Blind cannot be less than 1.'}
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value >= 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Cap 3-4 players cannot be negative'));
                          },
                        }),
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name={['rake', 'capMoreThanFive']}
                      label='Cap 5+ players'
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'This field is required'},
                        // {min: 1, message: 'Big Blind cannot be less than 1.'}
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value >= 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Cap 5+ players cannot be negative'));
                          },
                        }),
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='maxPlayers'
                      label='Players on table'
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'This field is required'},
                        // {min: 1, message: 'Big Blind cannot be less than 1.'}
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value >= 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Players on table cannot be negative'));
                          },
                        }),
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='minBuyIn'
                      label='Min. Buy-In'
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'This field is required'},
                        // {min: 1, message: 'Big Blind cannot be less than 1.'}
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value >= 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Min. Buy-In cannot be negative'));
                          },
                        }),
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='maxBuyIn'
                      label='Max. Buy-In'
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'This field is required'},
                        // {min: 1, message: 'Big Blind cannot be less than 1.'}
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value >= 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Max. Buy-In cannot be negative'));
                          },
                        }),
                      ]}
                    >
                      <Input
                        type='number'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      label='Straddle'
                      name={'isStraddleEnable'}
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'Stakes is required'}
                      ]}
                    >
                      <Select
                        className='w-100'
                        options={[
                          {
                            label: 'Straddle Mandatory',
                            value: true
                          },
                          {
                            label: 'Straddle Optional',
                            value: false
                          },
                        ]}
                        placeholder='Please select'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      label='Turn Time(sec.)'
                      name={'turnTime'}
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'Turn Time is required'}
                      ]}
                    >
                      <Select
                        className='w-100'
                        options={TurnTimeOptions}
                        placeholder='Please select'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      label='Private table'
                      name={'isPrivateTabel'}
                      className='mb-0'
                      // requiredMark={'optional'}
                      // rules={[
                      //   {required: true, message: 'Turn Time is required'}
                      // ]}
                    >
                      <Select
                        className='w-100'
                        options={[
                          {
                            label: 'Yes',
                            value: true,
                          },
                          {
                            label: 'No',
                            value: false,
                          }
                        ]}
                        placeholder='Select Private Table'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      label='Is Run It Twice'
                      name={'isRunItTwice'}
                      className='mb-0'
                      requiredMark={'optional'}
                      rules={[
                        {required: true, message: 'Is Run It Twice is required'}
                      ]}
                    >
                      <Select
                        className='w-100'
                        options={[
                          {
                            label: 'Yes',
                            value: true,
                          },
                          {
                            label: 'No',
                            value: false,
                          }
                        ]}
                        placeholder='Select Run It Twice'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='passwordForPrivate'
                      label='Password for Private'
                      className='mb-0'
                      // requiredMark={'optional'}
                      rules={data.isPrivateTabel?.value ? [
                        {required: true, message: 'Password is required for private table.'}
                      ] : []}
                    >
                      <Input
                        disabled={!data.isPrivateTabel?.value}
                        type='text'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              {/* <div className="form-item">
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
              </div> */}

              {!viewOnly && <div className="form-buttons">
                <div className="row">
                  <div className="col-md-9 offset-md-3">
                    <button type="button" className="btn grey" onClick={() => nav(-1)}>Cancel</button>
                    <button type="submit" className={clsx('btn', 'info')}>Submit</button>
                  </div>
                </div>
              </div> || <>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='gameInfoString'
                      label='Game Info'
                      className='mb-0'
                      // requiredMark={'optional'}
                    >
                      <Input.TextArea
                        disabled={true}
                        rows={10}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='createdBy'
                      label='Created By'
                      className='mb-0'
                      // requiredMark={'optional'}
                    >
                      <Input
                        type='text'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='createdAt'
                      label='Created At'
                      className='mb-0'
                      // requiredMark={'optional'}
                    >
                      <Input
                        type='text'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='updatedBy'
                      label='Last Updated By'
                      className='mb-0'
                      // requiredMark={'optional'}
                    >
                      <Input
                        type='text'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Item
                      name='updatedAt'
                      label='Last Updated At'
                      className='mb-0'
                      // requiredMark={'optional'}
                    >
                      <Input
                        type='text'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              </>}
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  )
};

export default Page;