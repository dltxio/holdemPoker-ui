import { Fragment, useEffect, useRef, useState } from 'react';
import { Form, Input, Select } from 'antd';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router';

// Components
import { CheckboxList } from '@/components/shared/checkbox-list/CheckboxList';
import { PageTitle } from '@/components/shared/page-title/PageTitle';
import { useBusyContext } from '@/components/shared/busy';

// Helpers
import { getCheckedModules, getCurrentUserData, isValidUser, getCheckedModulesNewAff, getCheckedModulesDirect } from '@/helpers/common';

// Actions
import { createSubAgent } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Interfaces
import { ICreateSubAgentParam } from '../../interfaces/CreateSubAgent.interface';
import { ICreatedBy } from '../../interfaces/CreateAgent.interface';

// Constants
import { ROOT } from '@/constants';

import './CreateSubAgent.scss';

const Page = () => {
  const { affModules } = useAppSelector(store => store.global);
  const { user } = useAppSelector(store => store.auth);

  const nav = useNavigate();
  const busyContext = useBusyContext();
  const dispatch = useAppDispatch();
  const checkboxRef = useRef<any>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [codes, setCodes] = useState<number[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [userAuth, setUserAuth] = useState<string>(user?.role?.name);
  console.log("userAuth: ", userAuth);

  const [form] = Form.useForm();

  const handleChecked = (codes: number[]) => {
    setCodes([...codes]);
  }

  const initSubAgentData = () => {
    const currentUser = getCurrentUserData();

    const createdBy: ICreatedBy = {
      name: currentUser.name,
      userName: currentUser.userName,
      role: currentUser.role,
      id: currentUser.email
    };

    const subAgent: ICreateSubAgentParam = {
      name: '',
      userName: '',
      mobile: null,
      email: '',
      password: '',
      role: { name: 'subAffiliate', level: -1 },
      parentUser: '',
      dob: null,
      creditLimit: null,
      cityName: '',
      rakeCommision: null,
      realChips: 0,
      profit: 0,
      withdrawal: 0,
      status: null,
      address: '',
      createdBy,
      createdAt: Number(new Date()),
      upDateAt: Number(new Date()),
      withdrawalChips: 0,
      pulledRealChips: 0,
      deposit: 0,
      module: [],
      isAuthenticatorEnabled: ''
    }

    return subAgent;
  }

  const handleSubmit = async (values: any) => {
    const valid = await form.validateFields();
    if (!valid) return;

    // if (!codes || !codes.length) {
    //   dispatch(showAlert({ title: 'Error', content: 'User cannot be created with no module access' }));
    //   return;
    // }

    let params = initSubAgentData();

    if (codes && codes.length) params = { ...params, module: codes };
    if (values.address) params = { ...params, address: values.address };
    if (values.cityName) params = { ...params, cityName: values.cityName };
    if (values.creditLimit) params = { ...params, creditLimit: values.creditLimit };
    if (values.name) params = { ...params, name: values.name };
    if (values.password) params = { ...params, password: values.password };
    if (values.rakeCommision) params = { ...params, rakeCommision: parseInt(values.rakeCommision) };
    if (values.status) params = { ...params, status: values.status };
    if (values.userName) params = { ...params, userName: values.userName };
    if (values.parentUser) params = { ...params, parentUser: values.parentUser };
    params = { ...params, isAuthenticatorEnabled: "true" };

    try {
      busyContext.showBusy();
      const res = unwrapResult(await dispatch(createSubAgent(params)));
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
    nav('/listSubAffiliate');
  }

  useEffect(() => {
    if (affModules && affModules.length) {
      if (userAuth === "affiliate") {
        setModules(getCheckedModulesNewAff(affModules, ROOT.filterModuleSubAffiliate));
      } else if (userAuth === "Director") {
        console.log("vao day 11111");
        setModules(getCheckedModulesDirect(affModules, ROOT.filterModuleSubAffiliate));
      } else {
        setModules(getCheckedModules(affModules, ROOT.filterModuleSubAffiliate));
      }
    }
  }, [affModules, userAuth]);

  return (
    <Fragment>
      <div className="create-sub-agent-content">
        <PageTitle
          text="Create Sub-Agent"
          mode="bold"
          type="danger"
          icon="bi-gear"
        />

        {isValidUser(user) && (
          <div className="form">
            <Form
              layout="vertical"
              autoComplete="off"
              onFinish={handleSubmit}
              form={form}
              initialValues={{
                parentUser: user.role.level <= 0 ? user.userName : ''
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
                rules={[
                  { required: true, message: 'Please enter valid login id.' },
                  { pattern: new RegExp('[A-Za-z0-9_]{0,}'), message: 'Please enter valid login id.' },
                  { min: 2, message: 'Please enter valid login id.' },
                  // { max: 15, message: 'Please enter valid login id.' }
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
                label="User Role"
                name="role"
              >
                <Select
                  className="default"
                  defaultValue="subAffiliate"
                  options={[
                    { label: 'Sub-Agent', value: 'subAffiliate' }
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Agent Username"
                name="parentUser"
                rules={[
                  { required: true, message: 'Please enter valid agent username.' },
                ]}
              >
                <Input
                  placeholder="Name"
                  className="default"
                  disabled={user.role.level <= 0}
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <Form.Item
                label="Credit Limit"
                name="creditLimit"
                rules={[
                  { required: true, message: 'Please provide a valid input.' },
                  { pattern: new RegExp('[0-9]{1,20}'), message: 'Please provide a valid input.' },
                ]}
              >
                <Input
                  placeholder="Credit Limit"
                  className="default"
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <Form.Item
                label="City"
                name="cityName"
                rules={[
                  { pattern: new RegExp('^[a-zA-Z\s]*$'), message: 'City name can not contain any numeric value.' },
                ]}
              >
                <Input
                  placeholder="City"
                  className="default"
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <Form.Item
                label="Commission %"
                name="rakeCommision"
                rules={[
                  { required: true, message: 'Please enter a valid commission percent.' },
                  { pattern: new RegExp('^[1-9][0-9]?$|^100$'), message: 'Please enter a valid commission percent.' },
                ]}
              >
                <Input
                  placeholder="Commission"
                  className="default"
                  type="number"
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
                  defaultValue=""
                  options={[
                    { label: '--Select Status--', value: '' },
                    { label: 'Active', value: 'Active' },
                    { label: 'Block', value: 'Block' }
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
              >
                <Input.TextArea
                  className="default"
                  placeholder="Max. 225 characters."
                  maxLength={255}
                  rows={3}
                />
              </Form.Item>

              <Form.Item
                label="Enable 2FA(google authenticator)"
                name="isAuthenticatorEnabled"
                rules={[
                  // { required: true, message: 'Enable 2FA(google authenticator) is required.' },
                ]}
              >
                <Select
                  className="default"
                  defaultValue="true"
                  options={[
                    { label: 'true', value: 'true' }
                  ]}
                />
              </Form.Item>

              <div className="form-item">
                <label>Modules/SubModules</label>

                <CheckboxList
                  data={(user.role.level <= 0 ? modules : affModules) || []}
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
        )}
      </div>
    </Fragment>
  )
};

export default Page;