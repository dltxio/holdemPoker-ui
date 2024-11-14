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

// Helpers
import { getCheckedModules, toStringArray } from '@/helpers/common';

// Actions
import { getAffDetail, updateAff } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Interfaces
import { IAffDetailParam, IUpdateAffParam } from '../../interfaces/CreateAff.interface';

// Constants
import { ROOT } from '@/constants';

import './EditAffiliate.scss';

const Page = () => {
  const { affModules } = useAppSelector(store => store.global);

  const busyContext = useBusyContext();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const nav = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [codes, setCodes] = useState<number[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);

  const [form] = Form.useForm();

  const handleChecked = (codes: number[]) => {
    setCodes([...codes]);
  }

  useEffect(() => {
    if (data?.module) {
      handleChecked(toStringArray(data?.module));
    }
  }, [data?.module]);

  const handleSubmit = async (values: any) => {
    const valid = await form.validateFields();
    if (!valid) return;

    // if (!codes || !codes.length) {
    //   dispatch(showAlert({ title: 'Error', content: 'User cannot be created with no module access' }));
    //   return;
    // }

    const params: IUpdateAffParam = {
      ...data,
      address: values.address,
      cityName: values.cityName,
      module: toStringArray(codes),
      name: values.name,
      password: values.password,
      rakeCommision: values.rakeCommision,
      status: values.status,
      userName: values.userName,
      isAuthenticatorEnabled: values.isAuthenticatorEnabled
    }

    try {
      busyContext.showBusy();
      const res = unwrapResult(await dispatch(updateAff(params)));
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
      const params: IAffDetailParam = {
        limit: 0,
        roleName: 'newaffiliate',
        skip: 0,
        _id: id
      };
      const res = await dispatch(getAffDetail(params));
      setData(res.payload[0]);
    } catch (e) {
      console.log(e);
    }
  }

  const back = () => {
    nav('/listAff');
  }

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  useEffect(() => {
    if (affModules && affModules.length) {
      setModules(getCheckedModules(affModules, ROOT.filterModuleNewAff));
    }
  }, [affModules]);

  return (
    <Fragment>
      <div className="edit-affiliate-content">
        <PageTitle
          text="Edit Affiliate"
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
                role: 'newaffiliate',
                password: data.password,
                cityName: data.cityName,
                rakeCommision: data.rakeCommision,
                status: data.status,
                address: data.address,
                isAuthenticatorEnabled: data.isAuthenticatorEnabled
              }}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter valid name.' },
                  { pattern: new RegExp('^[a-zA-Z\s]*$'), message: 'Please enter valid name.' }
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
                  className="default"
                  disabled
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <Form.Item
                label="User Role"
                name="role"
              >
                <Select
                  className="default"
                  disabled
                  options={[
                    { label: 'Affiliate', value: 'newaffiliate' }
                  ]}
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
                  { required: true, message: 'Enable 2FA(google authenticator) is require.' }
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