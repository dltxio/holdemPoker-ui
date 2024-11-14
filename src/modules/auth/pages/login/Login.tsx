import { Fragment } from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router';
import { login } from '@/modules/auth/store/action';
import { useAppDispatch } from '@/store/hooks';

import './Login.scss';
import { showAlert } from '@/store/global/action';
import { IAlertData } from '@/interfaces/global.interface';
import { useBusyContext } from "@/components/shared/busy";

const Login = () => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const bs = useBusyContext();

  const onFinish = async (values: any) => {
    if (
      !values ||
      !values.userName ||
      !values.password ||
      values.userName.trim() === '' ||
      values.password.trim() === ''
    ) {
      const error: IAlertData = {
        title: 'Error!',
        content: 'Insufficient info!'
      }
      d(showAlert(error));
    } else {
      const res = await d(login(values));
      bs.showBusy();
      if (!res?.payload?.uniqueSessionId) {
        const error: IAlertData = {
          title: 'Error!',
          content: 'username or password is incorrect.'
        }
        d(showAlert(error));
        bs.hideBusy();
      } else {
        bs.hideBusy();
        if (res.payload.isAuthenticatorEnabled && res.payload.isAuthenticatorEnabled === "true") {
          nav('/googleAuthen');
        } else {
          nav('/dashboard');
          // setTimeout(() => {
          //   window.location.reload();
          //   nav('/dashboard');
          // }, 0);
        }
      }
    }
  }

  const onFinishFailed = () => {

  }

  return (
    <Fragment>
      <div className="login-content">
        <h3>Sign In</h3>

        <Form
          className="default"
          initialValues={{ remember: true, userName: 'Admin', password: 'adminpassword' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            name='userName'
          >
            <Input
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name='password'
          >
            <Input.Password
              visibilityToggle={false}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>

        <a className="forgot" href="/forgotPassword">Forgot Password</a>
      </div>
    </Fragment>
  );
}

export default Login;