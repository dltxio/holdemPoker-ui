import { Fragment, useState, useEffect } from 'react';
import { Form, Input } from 'antd';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import { CheckboxList } from '@/components/shared/checkbox-list/CheckboxList';
import { PageTitle } from '@/components/shared/page-title/PageTitle';

// Actions
import { getUserDetail } from '../../store/action';

// Interfaces
import { IUserDetailParam } from '../../interfaces/CreateUser.interface';

// Helpers
import { toStringArray } from '@/helpers/common';

import './ViewUser.scss';

const Page = () => {
  const { modules } = useAppSelector(store => store.global);
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const [data, setData] = useState<any>(null);

  const handleChecked = () => { }

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

  return (
    <Fragment>
      <div className="view-user-content">
        <PageTitle
          text="View User"
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
                role: data.role.name,
                reportingTo: data.reportingTo,
                status: data.status,
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
                label="Department"
                name="role"
              >
                <Input
                  className="default"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Reporting to"
                name="reportingTo"
              >
                <Input
                  className="default"
                  disabled
                  prefix={<i className="bi bi-lock"></i>}
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
                      <button
                        type="button"
                        className={clsx('btn', 'primary')}
                        onClick={back}
                      >Back</button>
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