import React, { Fragment, useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Tag } from 'antd';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

import './CreateLeaderboardForm.scss';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { useAppDispatch } from '@/store/hooks';
import { useNavigate } from 'react-router';
import dayjs from '@/core/dayjs';
import TextArea from 'antd/lib/input/TextArea';
import { Textarea } from '@/components/shared/textarea/Textarea';
import { getListTable } from '@/modules/game/store/action';
import { LeaderBoardActionEnum, LeaderboardTypes, LeaderboardTypesEnum } from '@/modules/leaderboard/models/Leaderboard';
import DatePicker from '@/components/antd/DatePicker';
import { showAlert } from '@/store/global/action';
import { createLeaderboard, editLeaderboard } from '@/modules/leaderboard/store/action';
import { getCurrentUserData } from '@/helpers/common';
import { ICreatedBy } from '@/modules/user/interfaces/CreateAgent.interface';

type Props = {
  action: string;
  initialValues?: any;
  resetText?: string;
  submitText?: string;
}

const CreateLeaderboardForm: React.FC<Props> = ({
  action = LeaderBoardActionEnum.create,
  initialValues,
  resetText = 'Reset',
  submitText = 'Submit',
}) => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const bs = useBusyContext();
  const cf = useConfirmationContext();

  const [form] = Form.useForm();
  const [data, setData] = useState<any>({});
  const [tablesSelected, setTableSelected] = useState<any>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [disableHands, setDisableHands] = useState<boolean>(false);
  const [disableMinPoints, setDisableMinPoints] = useState<boolean>(false);
  const [showBonus, setShowBonus] = useState<boolean>(false);
  const [showMinRake, setShowMinRake] = useState<boolean>(false);

  const handleFieldsChange = (fields: any) => {
    data[fields[0].name[0]] = fields[0];
    setData({ ...data });
  }
  const handleOnChange = (date: any, dateString: string) => { };

  const handleSelectTable = (id: any) => {
    const index = tables.findIndex(x => x._id === id);
    setTableSelected([...tablesSelected, tables[index]]);
    tables.splice(index, 1);
    setTables([...tables]);
    form.resetFields(['tables'])
  }
  const handleRemoveTable = (index: number) => {
    setTables([...tables, tablesSelected[index]]);
    tablesSelected.splice(index, 1);
    setTableSelected([...tablesSelected]);
    form.validateFields(['tables'])
  }

  const handleChangeLeaderBoardType = (type: string) => {
    switch (type) {
      case LeaderboardTypesEnum.openVip:
        setDisableHands(true);
        form.resetFields(['minHands']);
        form.setFieldValue('minHands', 0);
        setDisableMinPoints(false);
        setShowBonus(false);
        setShowMinRake(false);
        break;
      case LeaderboardTypesEnum.closedVip:
        setDisableHands(true);
        form.resetFields(['minHands']);
        form.setFieldValue('minHands', 0);
        setDisableMinPoints(false);
        setShowBonus(true);
        setShowMinRake(false);
        break;
      case LeaderboardTypesEnum.openHand:
        setDisableHands(false);
        form.resetFields(['minVipPoints']);
        form.setFieldValue('minVipPoints', 0);
        setDisableMinPoints(true);
        setShowBonus(false);
        setShowMinRake(true);
        break;
      case LeaderboardTypesEnum.closedHand:
        setDisableHands(false);
        form.resetFields(['minVipPoints']);
        form.setFieldValue('minVipPoints', 0);
        setDisableMinPoints(true);
        setShowBonus(true);
        setShowMinRake(true);
        break;
    }
  }
  const addArrayElements = (a: any, b: any) => {
    let sum = parseInt(a) + parseInt(b);
    return (sum);
  };


  const handleback = () => {
    nav('/viewLeaderboard');
  }
  const handleSubmit = async (values: any) => {
    try {
      console.log(values)
      const { startDate, endDate } = values;
      if (!startDate || !endDate) {
        d(showAlert({
          title: 'Error!',
          content: 'Start date or End date is missing !!'
        }))
        return;
      };

      if (dayjs(startDate).isSame(endDate)) {
        d(showAlert({
          title: 'Error!',
          content: 'Start Date and End Date cannot be equal !!'
        }))
        return;
      };

      if (dayjs(startDate).isAfter(endDate)) {
        d(showAlert({
          title: 'Error!',
          content: 'End date must be greater than start date !!'
        }))
        return;
      };
      const payout = Array.from({ length: values.noOfWinners }, (v, i) => i + 1).map(item => values[`rank${item}`]);
      let params: any = {
        startTime: Number(new Date(startDate)),
        endTime: Number(new Date(endDate)),
        leaderboardName: values.leaderboardName,
        leaderboardType: values.leaderboardType,
        description: values.description,
        minVipPoints: values.minVipPoints,
        minHands: values.minHands,
        noOfWinners: values.noOfWinners,
        totalPrizePool: values.totalPrizePool,
        tables: tablesSelected.map((table: any) => {
          return {
            "_id": table._id,
            "channelName": table.channelName,
            "smallBlind": table.smallBlind,
            "bigBlind": table.bigBlind
          }
        }),
        payout,
        percentAccumulation: values.percentAccumulation,
      };

      if (values.termsCondition > 0) {
        params.termsCondition = Array.from({ length: values.termsCondition }, (v, i) => i + 1).map(item => values[`TC${item}`]);
      }

      if (showMinRake) {
        params.termsCondition = values.minRake;
      }

      let payoutSum = params.payout.reduce(addArrayElements);
      if (payoutSum > values.totalPrizePool) {
        d(showAlert({
          content: 'Prize distribution cannot be greater than total prize pool. !'
        }))
        return;
      }

      if (payoutSum < values.totalPrizePool) {
        d(showAlert({
          content: 'Prize distribution cannot be less than total prize pool. !'
        }))
        return;
      }
      bs.showBusy();
      const currentUser = getCurrentUserData();

      switch (action) {
        case LeaderBoardActionEnum.create:
          const res: any = await d(createLeaderboard({
            ...params,
            createdBy: currentUser.role
          }));
          bs.hideBusy();
          if (res?.payload?._id) {
            d(showAlert({
              content: 'Leaderboard created successfully.'
            }));
            nav('/viewLeaderboard');
          } else if (res?.payload?.status === 400) {
            d(showAlert({
              title: 'Error!',
              content: res?.payload?.info
            }));
          } else {
            d(showAlert({
              title: 'Error!',
              content: res?.error?.message || 'Getting error from server in creating leaderboard !'
            }));
          }
          break;
        case LeaderBoardActionEnum.edit:
          const update: any = await d(editLeaderboard({
            ...params,
            updatedBy: currentUser.role,
            updatedAt: Number(new Date()),
            id: initialValues.id
          }));
          bs.hideBusy();
          if (update?.payload?.success) {
            d(showAlert({
              content: 'Leaderboard update successfully.'
            }));
            nav('/viewLeaderboard');
          } else if (update?.payload?.status === 400) {
            d(showAlert({
              title: 'Error!',
              content: update?.payload?.info
            }));
          } else {
            d(showAlert({
              title: 'Error!',
              content: update?.error?.message || 'Getting error from server in creating leaderboard !'
            }));
          }

          break;
        case LeaderBoardActionEnum.duplicate:
          const duplicate: any = await d(createLeaderboard({
            ...params,
            createdBy: currentUser.role
          }));
          bs.hideBusy();
          if (duplicate?.payload?._id) {
            d(showAlert({
              content: 'Leaderboard created successfully.'
            }));
            nav('/viewLeaderboard');
          } else if (duplicate?.payload?.status === 400) {
            d(showAlert({
              title: 'Error!',
              content: duplicate?.payload?.info
            }));
          } else {
            d(showAlert({
              title: 'Error!',
              content: duplicate?.error?.message || 'Getting error from server in creating leaderboard !'
            }));
          }
          break;
      }


    } catch (e) {
      console.log(e);
      bs.hideBusy();

    }
  }
  const handleReset = () => {
    form.resetFields();
    setDisableHands(false);
    setDisableMinPoints(false);
    setShowBonus(false);
    setShowMinRake(false);
  }
  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return !dayjs(current).isToday() && dayjs().isAfter(dayjs(current));
  };

  const getTables = async () => {
    try {
      bs.showBusy();
      const res = await d(getListTable({
        "isRealMoney": "true",
        "channelType": "NORMAL",
        "isActive": "true"
      }));
      const listTable = [...res.payload];
      if (initialValues?.tables) {
        for (const table of initialValues?.tables) {
          const index = listTable.findIndex((x: any) => x._id === table._id);
          if (index > -1) {
            listTable.splice(index, 1);
          }
        }
        setTableSelected(initialValues.tables);
      }
      setTables(listTable);
      if(initialValues){
        delete initialValues.tables
      }
      form.resetFields(['tables']);
    } finally {
      bs.hideBusy();
    }
  }

  useEffect(() => {
    console.log(action, initialValues)
  
    getTables();
  }, [])
  return (
    <Fragment>
      <div className="create-leaderboard-form-content">
        <Form
          form={form}
          labelCol={{
            md: 10
          }}
          onFinish={handleSubmit}
          onFieldsChange={handleFieldsChange}
          disabled={action === LeaderBoardActionEnum.view}
          initialValues={
            initialValues
          }
        >
          <div className="form-item">
            <div className="row">
              <div className="col-md-9">
                <Form.Item
                  name='leaderboardName'
                  label="Leaderboard Name"
                  requiredMark='optional'
                  rules={[{ required: true, message: 'Special character are not allowed in leaderboard name.' }]}
                >
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Leaderboard Name"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="form-item">
            <div className="row">

              <div className="col-md-9">
                <Form.Item
                  name='leaderboardType'
                  label="Leaderboard Type"
                >
                  <Select
                    className="form-select"
                    placeholder="Please select"
                    options={LeaderboardTypes}
                    onChange={handleChangeLeaderBoardType}
                  />
                </Form.Item>
              </div>

            </div>
          </div>
          {
            showBonus && <div className="form-item">
              <div className="row">
                <div className="col-md-9">
                  <Form.Item
                    name='bonusCode'
                    label="Bonus Code"
                    requiredMark='optional'
                    rules={[{ required: true, message: 'Please provide valid bonus code for this leaderboard.' }]}
                  >
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Bonus Code"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          }


          <div className="form-item">

            <div className="row">
              <div className="col-md-9">
                <Form.Item
                  name='description'
                  label="Leaderboard Description"
                >
                  <TextArea
                    maxLength={255}
                    rows={4}
                    placeholder="Leaderboard Description"
                  />
                </Form.Item>
              </div>
            </div>

          </div>

          <div className="form-item">

            <div className="row">
              <div className="col-md-9">
                <Form.Item
                  name='startDate'
                  label="Start Date"
                >
                  <DatePicker
                    className="default form-control"
                    placeholder="Start Date"
                    onChange={handleOnChange}
                    suffixIcon={<FontAwesomeIcon icon={faCalendarDays} />}
                    allowClear={false}
                    showTime={true}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </div>
            </div>

          </div>

          <div className="form-item">

            <div className="row">
              <div className="col-md-9">
                <Form.Item
                  name='endDate'
                  label="End Date"
                >
                  <DatePicker
                    className="default form-control"
                    placeholder="End Date"
                    onChange={handleOnChange}
                    suffixIcon={<FontAwesomeIcon icon={faCalendarDays} />}
                    allowClear={false}
                    showTime={true}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </div>
            </div>

          </div>

          <div className="form-item">

            <div className="row">
              <div className="col-md-9">
                <Form.Item
                  name='minVipPoints'
                  label="Min Leaderboard Points"
                >
                  <InputNumber
                    type="number"
                    className="form-control"
                    disabled={disableMinPoints || action === LeaderBoardActionEnum.view}
                    placeholder="Min. Leaderboard Points"
                  />
                </Form.Item>
              </div>
            </div>

          </div>

          <div className="form-item">
            <div className="row">
              <div className="col-md-9">
                <Form.Item
                  name='minHands'
                  label="Minimum Hands"
                >
                  <InputNumber
                    disabled={disableHands || action === LeaderBoardActionEnum.view}
                    className="form-control"
                    placeholder="Min. No. of Hands"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          {
            showMinRake && <div className="form-item">
              <div className="row">
                <div className="col-md-9">
                  <Form.Item
                    name='minRake'
                    label="Minimum Rake Amount"
                  >
                    <InputNumber
                      className="form-control"
                      placeholder="Minimum Rake Amount"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          }


          <div className="form-item">

            <div className="col-md-9">
              <Form.Item
                name='tables'
                label="Table Names"
                rules={
                  [{
                    validator: (_, value) => {
                      if (tablesSelected.length === 0) {
                        return Promise.reject(new Error('Please select valid table from list.'))
                      }
                      return Promise.resolve();
                    },
                  }]
                }
              >
                <Select
                  className="form-select"
                  placeholder={tablesSelected?.length > 0 ? 'Select next table' : 'Select Tables'}
                  options={tables.map(item => ({
                    label: item.channelName,
                    value: item._id
                  }))}
                  onChange={handleSelectTable}
                  value={undefined}
                />
              </Form.Item>
            </div>
          </div>

          {tablesSelected?.length > 0 && <div className="form-item">
            <div className="row">
              <div className="col-md-4">
                <label className="form-item__label">Selected Tables :</label>
              </div>

              <div className="col-md-5">

                {
                  tablesSelected.map((item: any, index: number) => (
                    <Tag className="form-tag"
                      key={item._id} closable={true} onClose={() => handleRemoveTable(index)}>{item.channelName}</Tag>
                  ))
                }
              </div>
            </div>
          </div>}

          <div className="form-item">

            <div className="row">
              <div className="col-md-9">
                <Form.Item
                  name='percentAccumulation'
                  label="Percent Points Accumulation"
                  rules={[
                    {
                      validator(_, value) {
                        if (value < 1) {
                          return Promise.reject(new Error('Percent Points Accumulation cannot be less than 1.'));
                        }
                        return Promise.resolve();
                      },
                    }
                  ]}
                  extra={
                    form.getFieldValue('percentAccumulation')
                    && <span className="form-message">
                      1 LeaderboardPoint = ₹ {(1 * 100) / form.getFieldValue('percentAccumulation')} Rake
                    </span>
                  }
                >
                  <InputNumber
                    type="text"
                    className="form-control"
                    placeholder="Percent Points Accumulation"
                    min={0}
                  />
                </Form.Item>

              </div>
            </div>


          </div>

          <div className="form-item">

            <div className="row">
              <div className="col-md-9">
                <Form.Item
                  name='totalPrizePool'
                  label="Total Prize Pool"
                  rules={[
                    {
                      validator(_, value) {
                        if (value < 1) {
                          return Promise.reject(new Error('Total prize pool cannot be less than 1.'))
                        }
                        return Promise.resolve();
                      },
                    }
                  ]}
                >
                  <InputNumber
                    min={0}
                    placeholder="Total Prize Pool"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="form-item">
            <div className="row">
              <div className="col-md-9">
                <Form.Item
                  name='noOfWinners'
                  label="No. of winners"
                  rules={[
                    {
                      validator(_, value) {
                        if (value < 2 || value > 100) {
                          return Promise.reject(new Error('No. of winners should be between 2 to 100.'))
                        }
                        return Promise.resolve();
                      },
                    }
                  ]}
                >
                  <InputNumber
                    className="form-control"
                    min={0}
                    placeholder="No. of winners"
                  />
                </Form.Item>
              </div>
            </div>


          </div>
          {form.getFieldValue('noOfWinners') > 1 &&
            Array.from({ length: form.getFieldValue('noOfWinners') }, (v, i) => i + 1).map((item: number, index: number) => (
              <div className="form-item" key={item}>
                <div className="row">
                  <div className="col-md-9">
                    <Form.Item
                      name={`rank${item}`}
                      label={`rank ${item}`}
                      rules={[
                        {
                          validator(_, value) {
                            if (value < 1) {
                              return Promise.reject(new Error('Prize Money for the topmost rank winner can neither be greater than total prize pool nor can be less than zero.'))
                            }
                            return Promise.resolve();
                          },
                        }
                      ]}
                    >
                      <InputNumber
                        className="form-control"
                        min={0}
                        placeholder={`Prize Money (Rank ${item})`}
                      />
                    </Form.Item>
                  </div>
                </div>


              </div>
            ))
          }

          <div className="form-item">
            <div className="row">
              <div className="col-md-9">
                <Form.Item
                  name='termsCondition'
                  label="Terms And Condition"
                  extra={form.getFieldValue('termsCondition') === 0 ? 'Minimum no. of terms and conditions is 1.' : ''}
                >
                  <InputNumber
                    type="text"
                    className="form-control"
                    min={0}
                    placeholder="No. of T&C"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {
            Array.from({ length: form.getFieldValue('termsCondition') }, (v, i) => i + 1).map((item: number, index: number) => (
              <div className="form-item" key={item}>
                <div className="row">
                  <div className="col-md-9">
                    <Form.Item
                      name={`TC${item}`}
                      label={`T&C ${item}`}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter valid terms and condition.'
                        }
                      ]}
                    >
                      <Input
                        type="text"
                        className="form-control"
                        min={0}
                        placeholder={`T&C ${item}`}
                      />
                    </Form.Item>
                  </div>
                </div>


              </div>
            ))
          }


          <div className="form-buttons">
            <div className="row">
              <div className="btn-center">
                {action !== LeaderBoardActionEnum.view && <Fragment>
                  <button type="button" className="btn grey" onClick={handleReset}>{resetText}</button>
                  <button type="submit" className={clsx('btn', 'info')}>{submitText}</button>
                </Fragment>}
                {action === LeaderBoardActionEnum.view && <button type="button" onClick={handleback} className={clsx('btn', 'info')}>{submitText}</button>}
              </div>
            </div>
          </div>
        </Form>
      </div>
    </Fragment>
  );
}

export { CreateLeaderboardForm }