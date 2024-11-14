import { Fragment, useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import clsx from 'clsx';
import { useAppDispatch } from '@/store/hooks';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import { PageTitle } from '@/components/shared/page-title/PageTitle';
import { useBusyContext } from '@/components/shared/busy';

// Helpers
import { getCurrentUserData } from '@/helpers/common';

// Actions
import { getPlayerDetail, updatePlayer } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Interfaces
import { IPlayerDetailParam, IUpdatePlayerParam } from '../../interfaces/CreatePlayer.interface';

import './EditPlayer.scss';

const Page = () => {
  const busyContext = useBusyContext();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState<any>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showReason, setShowReason] = useState<boolean>(false);
  const [disableParent, setDisableParent] = useState<boolean>(true);

  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    const valid = await form.validateFields();
    if (!valid) return;

    const params: IUpdatePlayerParam = {
      ...data,
      isParentUserName: values.isParentUserName,
      password: values.password,
      rakeBack: values.rakeBack,
      reasonForBan: values.reasonForBan ? values.reasonForBan : '',
      status: values.status,
      userName: values.userName,
      isBlocked: values.reasonForBan ? true : false,
      sponserId: values.sponserId,
      emailId: values.emailId,
    }

    try {
      console.log("params: ", params);
      busyContext.showBusy();
      const res = unwrapResult(await dispatch(updatePlayer(params)));
      dispatch(showAlert({ content: res.message }, 'success'));
      back();
    } catch (e: any) {
      dispatch(showAlert({ content: e.message }, 'error'));
    } finally {
      busyContext.hideBusy();
    }
  }

  const handleValuesChange = (data: any) => {
    if (data && data.status) {
      if (data.status === 'Active') {
        setShowReason(false);
      } else {
        setShowReason(true);
      }
    }
  }

  const back = () => {
    nav('/listPlayer');
  }

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

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  useEffect(() => {
    if (data && data.status === 'Block') {
      setShowReason(true);
    }
  }, [data]);

  useEffect(() => {
    const currentUser = getCurrentUserData();
    if (currentUser && currentUser.role.level >= 0) {
      setDisableParent(false);
    }
  }, []);

  return (
    <Fragment>
      <div className="edit-player-content">
        <PageTitle
          text="Edit Player"
          mode="bold"
          type="danger"
          icon="bi-gear"
        />

        {data && (
          <div className="form">
            <Form
              layout="vertical"
              autoComplete="off"
              onFinish={handleSubmit}
              form={form}
              onValuesChange={handleValuesChange}
              initialValues={{
                userName: data.userName,
                password: data.password,
                status: data.status,
                isParentUserName: data.isParentUserName,
                rakeBack: data.rakeBack,
                reasonForBan: data.reasonForBan,
                sponserId: data.sponserId,
                emailId: data.emailId
              }}
            >
              <Form.Item
                label="UserName"
                name="userName"
              >
                <Input
                  className="default"
                  disabled
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please enter valid password.' },
                  { min: 6, message: 'Please enter valid password.' },
                  { max: 20, message: 'Please enter valid password.' }
                ]}
              >
                <Input.Password
                  className="default"
                  placeholder="Password"
                  prefix={<i className="bi bi-lock"></i>}
                  iconRender={visible => null}
                  visibilityToggle={{ visible: showPassword }}
                />
              </Form.Item>

              <div className="form-item__checkbox">
                <input type="checkbox" onChange={(event) => setShowPassword(event.target.checked)} />
                <span>Show password</span>
              </div>

              <Form.Item
                label="Email"
                name="emailId"
              >
                <Input
                  className="default"
                  disabled={disableParent}
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[
                  { required: true, message: 'Status is required.' },
                ]}
              >
                <Select
                  className="default"
                  options={[
                    { label: 'Active', value: 'Active' },
                    { label: 'Block', value: 'Block' }
                  ]}
                />
              </Form.Item>

              {showReason && (
                <Form.Item
                  label="Reason for Ban"
                  name="reasonForBan"
                >
                  <Input
                    className="default"
                    prefix={<i className="bi bi-person-fill"></i>}
                  />
                </Form.Item>
              )}

              <Form.Item
                label="Change Parent"
                name="isParentUserName"
              >
                <Input
                  className="default"
                  disabled={disableParent}
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <Form.Item
                label="Sponser ID"
                name="sponserId"
              >
                <Input
                  className="default"
                  disabled={disableParent}
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              
              <Form.Item
                label="Rake Back"
                name="rakeBack"
                rules={[
                  { required: true, message: 'Please enter a valid input.' },
                  {
                    validator: (_, value) => {
                      const numberValue = Number(value);
                      if (isNaN(numberValue) || numberValue < 0) {
                        return Promise.reject('Please enter a valid input.');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  placeholder="Rake Back"
                  className="default"
                  type="number"
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <div className="form-buttons">
                <div className="row">
                  <div className="offset-md-3 col-md-9 col-sm-12">
                    <Form.Item shouldUpdate>
                      {() => (
                        <button
                          type="submit"
                          className={clsx('btn', 'primary')}
                          disabled={form.getFieldsError().filter(({ errors }) => errors.length).length > 0}
                        >Submit</button>
                      )}
                    </Form.Item>

                    <Form.Item>
                      <button onClick={back} type="button" className="btn grey">Cancel</button>
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