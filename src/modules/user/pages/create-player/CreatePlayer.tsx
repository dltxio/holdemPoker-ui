import { Fragment, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router';

// Components
import { PageTitle } from '@/components/shared/page-title/PageTitle';
import { useBusyContext } from '@/components/shared/busy';

// Helpers
import { getCurrentUserData } from '@/helpers/common';

// Actions
import { createPlayer } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Interfaces
import { ICreatePlayerParam } from '../../interfaces/CreatePlayer.interface';

import './CreatePlayer.scss';

const Page = () => {
  const busyContext = useBusyContext();
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [isSponsor, setIsSponsor] = useState(true);

  const { user } = useAppSelector(store => store.auth);

  const initPlayerData = () => {
    const currentUser = getCurrentUserData();

    const player: ICreatePlayerParam = {
      status: 'INACTIVE',
      createdBy: currentUser.userName,
      parentUserRole: currentUser.role,
      isParentUserName: '',
      loggedInUser: currentUser.userName,
      isParent: '',
      mobileNumber: 0
    }

    return player;
  }

  const handleSubmit = async (values: any) => {
    const valid = await form.validateFields();
    if (!valid) return;

    let params = initPlayerData();

    if (values.firstName) params = { ...params, firstName: values.firstName };
    if (values.lastName) params = { ...params, lastName: values.lastName };
    if (values.userName) params = { ...params, userName: values.userName };
    if (values.emailId) params = { ...params, emailId: values.emailId };
    if (values.mobileNumber) params = { ...params, mobileNumber: parseInt(values.mobileNumber) };
    if (values.affiliateId) params = { ...params, affiliateId: values.affiliateId, isParentUserName: values.affiliateId };
    if (values.sponserId) params = { ...params, sponserId: values.sponserId ? values.sponserId : "admin" };
    if (values.rakeBack) params = { ...params, rakeBack: parseInt(values.rakeBack) };

    try {
      busyContext.showBusy();
      const res = unwrapResult(await dispatch(createPlayer(params)));
      dispatch(showAlert({ content: res.message }, 'success'));
      resetData();
    } catch (e: any) {
      dispatch(showAlert({ content: e.message }, 'error'));
    } finally {
      busyContext.hideBusy();
    }
  }

  const handleChangeSponsor = (e: any) => {
    let { name, value } = e.target;
    if (value.length > 0) {
      setIsSponsor(false)
    } else {
      setIsSponsor(true);
    }
  }

  const resetData = () => {
    form.resetFields();
  }

  const back = () => {
    nav('/listPlayer');
  }

  return (
    <Fragment>
      <div className="create-player-content">
        <PageTitle
          text="Create Player"
          mode="bold"
          type="danger"
          icon="bi-gear"
        />

        <div className="form">
          <Form
            layout="vertical"
            autoComplete="off"
            onFinish={handleSubmit}
            form={form}
            initialValues={{
              affiliateId: user.role.level <= 0 ? user.userName : ''
            }}
          >
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: 'Please enter valid first name.' },
                { pattern: new RegExp('[A-Za-z]{0,}'), message: 'Please enter valid first name.' }
              ]}
            >
              <Input
                placeholder="First Name"
                className="default"
                prefix={<i className="bi bi-person-fill"></i>}
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: 'Please enter valid last name.' },
                { pattern: new RegExp('[A-Za-z]{0,}'), message: 'Please enter valid last name.' },
              ]}
            >
              <Input
                placeholder="Last Name"
                className="default"
                prefix={<i className="bi bi-person-fill"></i>}
              />
            </Form.Item>

            <Form.Item
              label="Username"
              name="userName"
              rules={[
                { required: true, message: 'Please enter valid Username.' },
                { pattern: new RegExp('[A-Za-z]{0,}'), message: 'Please enter valid Username.' },
                { min: 2, message: 'Please enter valid Username.' },
                { max: 15, message: 'Please enter valid Username.' }
              ]}
            >
              <Input
                placeholder="Username"
                className="default"
                prefix={<i className="bi bi-person-fill"></i>}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="emailId"
              rules={[
                { required: true, message: 'Please enter valid Email.' },
                { pattern: new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'), message: 'Please enter valid Email.' },
              ]}
            >
              <Input
                placeholder="Email"
                className="default"
                prefix={<i className="bi bi-person-fill"></i>}
              />
            </Form.Item>

            {/* <Form.Item
              label="Mobile"
              name="mobileNumber"
              rules={[
                { required: true, message: 'Please enter valid Mobile.' },
                { pattern: new RegExp('[0-9]{0,}'), message: 'Please enter valid Mobile.' },
                { min: 10, message: 'Please enter valid Mobile.' },
                { max: 10, message: 'Please enter valid Mobile.' }
              ]}
            >
              <Input
                placeholder="Mobile"
                className="default"
                type="number"
                prefix={<i className="bi bi-person-fill"></i>}
              />
            </Form.Item> */}

            <Form.Item
              label="Password" 
              name="password"
              rules={[
                // { required: true, message: 'Please enter valid Password.' },
                { pattern: new RegExp('[a-zA-Z0-9_,@.]{6,15}'), message: 'Please enter valid Password.' }
              ]}
            >
              <Input
                placeholder='Password'
                className='default'
                prefix={<i className="bi bi-person-fill"></i>}
              />
            </Form.Item>

            <Form.Item
              label={user.role.level <= 0 ? 'Agent ID' : 'Agent or Affiliate ID'}
              name="affiliateId"
            >
              <Input
                placeholder="Agent or Affiliate ID"
                className="default"
                disabled={user.role.level <= 0}
                prefix={<i className="bi bi-person-fill"></i>}
              />
            </Form.Item>

            <Form.Item
              label={'Sponser ID'}
              name="sponserId"
            >
              <Input
                placeholder="Sponser ID"
                className="default"
                prefix={<i className="bi bi-person-fill"></i>}
                onChange={(e) => handleChangeSponsor(e)}
              />
            </Form.Item>

            {isSponsor && (
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
            )}


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
      </div>
    </Fragment>
  )
};

export default Page;