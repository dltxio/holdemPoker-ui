import { Fragment, useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import { CheckboxList } from '@/components/shared/checkbox-list/CheckboxList';
import { PageTitle } from '@/components/shared/page-title/PageTitle';
import { useBusyContext } from '@/components/shared/busy';

// Constants
import { ROOT } from '@/constants';

// Helpers
import { getRoleParam, toStringArray } from '@/helpers/common';

// Actions
import { getUserDetail, updateUser } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Interfaces
import { IUpdateUserParam, IUserDetailParam } from '../../interfaces/CreateUser.interface';

import './EditUser.scss';

const Page = () => {
  const { modules } = useAppSelector(store => store.global);
  const busyContext = useBusyContext();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const nav = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [codes, setCodes] = useState<number[]>([]);
  const [data, setData] = useState<any>(null);

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

    const role = getRoleParam(values.role);

    const params: IUpdateUserParam = {
      createdAt: data.createdAt,
      createdBy: data.createdBy,
      id: data.id,
      module: toStringArray(codes),
      name: values.name,
      password: values.password,
      reportingTo: values.reportingTo,
      role,
      roleName: role.name,
      status: values.status,
      userName: data.userName,
      _id: data._id,
      isAuthenticatorEnabled: values.isAuthenticatorEnabled
    }

    try {
      busyContext.showBusy();
      const res: any = unwrapResult(await dispatch(updateUser(params)));
      dispatch(showAlert({ content: res.message }, 'success'));
      back();
    } catch (e: any) {
      dispatch(showAlert({ content: e.message }, 'error'));
    } finally {
      busyContext.hideBusy();
    }
  }

  const fetchData = async (id: string) => {
    try {
      const params: IUserDetailParam = { level: 7, _id: id };
      const res = await dispatch(getUserDetail(params));
      setData(res.payload[0]);
    } catch (e) {
      console.log(e);
    }
  }

  const back = () => {
    nav('/listUsers');
  }

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  useEffect(() => {
    if (data && data.module && data.module.length) {
      setCodes([...data.module]);
    }
  }, [data]);

  return (
    <Fragment>
      <div className="edit-user-content">
        <PageTitle
          text="Edit User"
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
              initialValues={{
                name: data.name,
                userName: data.userName,
                password: data.password,
                role: data.role.level,
                reportingTo: data.reportingTo,
                status: data.status,
                isAuthenticatorEnabled: data.isAuthenticatorEnabled
              }}
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
              >
                <Input
                  placeholder="Username"
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
                  { required: true, message: 'Enable 2FA(google authenticator) is require.' }
                ]}
              >
                <Select
                  className="default"
                  options={ROOT.GoogleAuthenStatus}
                />
              </Form.Item>

              <div className="form-item">
                <label>Modules/SubModules</label>

                <CheckboxList
                  data={modules || []}
                  onChange={handleChecked}
                  checkedModules={toStringArray(data.module) || []}
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
                      <button onClick={back} type="button" className="btn grey">Back</button>
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