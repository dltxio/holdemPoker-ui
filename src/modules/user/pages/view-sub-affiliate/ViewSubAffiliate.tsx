import { Fragment, useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import { CheckboxList } from '@/components/shared/checkbox-list/CheckboxList';
import { PageTitle } from '@/components/shared/page-title/PageTitle';

// Helpers
import { getCheckedModules, toStringArray } from '@/helpers/common';

// Actions
import { getSubAffDetail } from '../../store/action';

// Interfaces
import { ISubAffDetailParam } from '../../interfaces/CreateSubAff.interface';

// Constants
import { ROOT } from '@/constants';

import './ViewSubAffiliate.scss';

const Page = () => {
  const { affModules } = useAppSelector(store => store.global);
  const { id } = useParams();
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const [modules, setModules] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);

  const handleChecked = () => { }

  useEffect(() => {
    if (affModules && affModules.length) {
      setModules(getCheckedModules(affModules, ROOT.filterModuleSubAffiliate));
    }
  }, [affModules]);

  const fetchData = async (id: string) => {
    try {
      const params: ISubAffDetailParam = {
        limit: 0,
        roleName: 'newsubAffiliate',
        skip: 0,
        _id: id
      };
      const res = await dispatch(getSubAffDetail(params));
      setData(res.payload[0]);
    } catch (e) {
      console.log(e);
    }
  }

  const back = () => {
    nav('/listSubaff');
  }

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  return (
    <Fragment>
      <div className="view-sub-affiliate-content">
        <PageTitle
          text="View Sub-Affiliate"
          mode="bold"
          type="danger"
          icon="bi-gear"
        />

        {data && (
          <div className="form">
            <Form
              layout="vertical"
              autoComplete="off"
              initialValues={{
                name: data.name,
                userName: data.userName,
                mobile: data.mobile,
                email: data.email,
                role: 'newsubAffiliate',
                parentUser: data.parentUser,
                dob: data.dob,
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
              >
                <Input
                  className="default"
                  disabled
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
                label="Mobile No."
                name="mobile"
              >
                <Input
                  className="default"
                  disabled
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
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
                    { label: 'Sub-Affiliate', value: 'newsubAffiliate' }
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Affiliate Name"
                name="parentUser"
              >
                <Input
                  className="default"
                  disabled
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <Form.Item
                label="Date of birth"
                name="dob"
              >
                <Input
                  className="default"
                  disabled
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <Form.Item
                label="City"
                name="cityName"
              >
                <Input
                  className="default"
                  disabled
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <Form.Item
                label="Commission %"
                name="rakeCommision"
              >
                <Input
                  className="default"
                  disabled
                  prefix={<i className="bi bi-person-fill"></i>}
                />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
              >
                <Select
                  className="default"
                  disabled
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
                  disabled
                  maxLength={255}
                  rows={3}
                />
                
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
              >
                <Select
                  className="default"
                  disabled
                  options={[
                    { label: '--Select Status--', value: '' },
                    { label: 'Active', value: 'Active' },
                    { label: 'Block', value: 'Block' }
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Enable 2FA(google authenticator)"
                name="isAuthenticatorEnabled"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <div className="form-item">
                <label>Modules/SubModules</label>

                <CheckboxList
                  data={modules || []}
                  onChange={handleChecked}
                  checkedModules={toStringArray(data.module) || []}
                  viewMode={true}
                />
              </div>

              <div className="form-buttons">
                <div className="row">
                  <div className="offset-md-3 col-md-9 col-sm-12">
                    <Form.Item>
                      <button onClick={back} type="button" className={clsx('btn', 'primary')}>Back</button>
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