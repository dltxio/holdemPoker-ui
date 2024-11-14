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
import { getAffDetail } from '../../store/action';

// Interfaces
import { IAffDetailParam } from '../../interfaces/CreateAff.interface';

// Constants
import { ROOT } from '@/constants';

import './ViewAffiliate.scss';

const Page = () => {
  const { affModules } = useAppSelector(store => store.global);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const nav = useNavigate();

  const [modules, setModules] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);

  const handleChecked = () => { }

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
      <div className="view-affiliate-content">
        <PageTitle
          text="View Affiliate"
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
                role: 'newaffiliate',
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