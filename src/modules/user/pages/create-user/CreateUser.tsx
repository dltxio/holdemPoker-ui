import { Fragment, useRef, useState } from 'react';
import { Form, Input, Select } from 'antd';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router';

// Components
import { CheckboxList } from '@/components/shared/checkbox-list/CheckboxList';
import { PageTitle } from '@/components/shared/page-title/PageTitle';
import { useBusyContext } from '@/components/shared/busy';

// Constants
import { ROOT } from '@/constants';

// Helpers
import { getCurrentUserData, getRoleParam } from '@/helpers/common';

// Actions
import { createUser } from '../../store/action';
import { showAlert } from '@/store/global/action';

import './CreateUser.scss';

const Page = () => {
  const { modules } = useAppSelector(store => store.global);
  const nav = useNavigate();
  const busyContext = useBusyContext();
  const dispatch = useAppDispatch();
  const checkboxRef = useRef<any>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [codes, setCodes] = useState<number[]>([]);

  const [form] = Form.useForm();

  const handleChecked = (codes: number[]) => {
    setCodes([...codes]);
  }

  const handleSubmit = async (values: any) => {
    const valid = await form.validateFields();
    if (!valid) return;

    if (!codes || !codes.length) {
      dispatch(showAlert({ title: 'Error', content: 'User cannot be created with no module access' }));
      return;
    }

    let params: any = values;

    if (params.role) {
      params = { ...params, countGoogleAuthen: 0, role: getRoleParam(params.role) };
    }

    const currentUser = getCurrentUserData();
    params = { ...params, countGoogleAuthen: 0, createdBy: currentUser.userName };

    params.module = codes;

    try {
      busyContext.showBusy();
      const res: any = unwrapResult(await dispatch(createUser(params)));
      dispatch(showAlert({ content: res.message }, 'success'));
      resetData();
    } catch (e: any) {
      dispatch(showAlert({ content: e.message }, 'error'));
    } finally {
      busyContext.hideBusy();
    }
  }

  const resetData = () => {
    setShowPassword(false);
    setCodes([]);
    form.resetFields();
    checkboxRef.current.resetChecked();
  }

  const back = () => {
    nav('/listUsers');
  }

  return (
    <Fragment>
      <div className="create-user-content">
        <PageTitle
          text="Create User"
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
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: 'Please enter valid name.' },
                { pattern: new RegExp('[A-Z a-z]{0,}'), message: 'Please enter valid name.' }
              ]}
            >
              <Input
                placeholder="Name"
                className="default"
                prefix={<i className="bi bi-person-fill"></i>}
              />
            </Form.Item>

            <Form.Item
              label="Username"
              name="userName"
              rules={[
                { required: true, message: 'Please enter valid Username.' },
                { pattern: new RegExp('[A-Za-z0-9_]{0,}'), message: 'Please enter valid Username.' },
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
              label="Level"
              name="role"
              rules={[
                { required: true, message: 'Level is required.' },
              ]}
            >
              <Select
                className="default"
                options={ROOT.employeeList}
              />
            </Form.Item>

            <Form.Item
              label="Reporting to"
              name="reportingTo"
              rules={[
                { required: true, message: 'Please enter valid user name.' },
              ]}
            >
              <Input
                placeholder="Reporting to"
                className="default"
                prefix={<i className="bi bi-lock"></i>}
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
                options={ROOT.employeeStatus}
              />
            </Form.Item>

            <Form.Item
              label="Enable 2FA(google authenticator)"
              name="isAuthenticatorEnabled"
              rules={[
                { required: true, message: 'Enable 2FA(google authenticator) is required.' },
              ]}
            >
              <Select
                className="default"
                defaultValue=""
                options={ROOT.GoogleAuthenStatus}
              />
            </Form.Item>

            <div className="form-item">
              <label>Modules/SubModules</label>

              <CheckboxList
                data={modules || []}
                onChange={handleChecked}
                ref={checkboxRef}
              />
            </div>

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