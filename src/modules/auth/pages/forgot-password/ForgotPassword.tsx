import { Fragment } from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/store/hooks';
import { checkVerifyAuthCode, verifyGoogleAuthenCode } from '@/modules/auth/store/action';

import './ForgotPassword.scss';
import { showAlert } from '@/store/global/action';
import { IAlertData } from '@/interfaces/global.interface';

const ForgotPassword = () => {
  const d = useAppDispatch();
  const nav = useNavigate();

  const onFinish = async (values: any) => {
    console.log("values: ", values);
    if (
      !values ||
      !values.email ||
      !values.code ||
      values.email.trim() === ''
    ) {
      const error: IAlertData = {
        title: 'Error!',
        content: 'Insufficient info!'
      }
      d(showAlert(error));
    } else {
      const resData: any = await d(checkVerifyAuthCode(values))
      console.log("resData: ", resData);
      if (resData?.payload?.data?.status === 200) {
        window.location.href = `/resetPassword/${resData?.payload?.data?.user._id}`;
      } else {
        d(showAlert({ title: 'Error!', content: resData?.payload?.data?.info }));
      }
    }
  }

  const onFinishFailed = () => {

  }

  return (
    <Fragment>
      <div className="forgot-password-content">
        <h3>Forgot Password</h3>

        <Form
          className="default"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            name='email'
          >
            <Input
              placeholder="Email OR UserName"
            />
          </Form.Item>

          <Form.Item
            name="code"
          >
            <Input
              placeholder='AuthCode'
            />

          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Fragment>
  );
}

export default ForgotPassword;