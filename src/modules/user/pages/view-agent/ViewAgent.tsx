import { Fragment, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import { CheckboxList } from '@/components/shared/checkbox-list/CheckboxList';
import { PageTitle } from '@/components/shared/page-title/PageTitle';

// Helpers
import { toStringArray } from '@/helpers/common';

// Actions
import { getAgentDetail } from '../../store/action';

// Interfaces
import { IAgentDetailParam } from '../../interfaces/CreateAgent.interface';

import './ViewAgent.scss';

const Page = () => {
  const { affModules } = useAppSelector(store => store.global);
  const { id } = useParams();
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any>(null);

  const handleChecked = () => { }

  const fetchData = async (id: string) => {
    try {
      const params: IAgentDetailParam = {
        limit: 0,
        roleName: 'affiliate',
        skip: 0,
        _id: id
      };
      const res = await dispatch(getAgentDetail(params));
      setData(res.payload[0]);
    } catch (e) {
      console.log(e);
    }
  }

  const back = () => {
    nav('/listOfAffiliate');
  }

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  return (
    <Fragment>
      <div className="view-agent-content">
        <PageTitle
          text="View Agent"
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
                password: data.password,
                role: 'Agent',
                creditLimit: data.creditLimit,
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
                label="Password"
                name="password"
              >
                <Input
                  className="default"
                  disabled
                  prefix={<i className="bi bi-lock"></i>}
                />
              </Form.Item>

              <Form.Item
                label="User Role"
                name="role"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Credit Limit"
                name="creditLimit"
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
                <Input
                  className="default"
                  disabled
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
                  data={affModules || []}
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