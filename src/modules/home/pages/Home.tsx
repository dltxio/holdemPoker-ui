import { login } from '@/modules/auth/store/action';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { useAppDispatch } from '@/store/hooks';
import { Card, Checkbox, Form, Input } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/shared/button/Button';

const Home = () => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const bs = useBusyContext();
  const cf = useConfirmationContext();

  const onFinish = async (values: any) => {
    await cf.showConfirm({message:'Are you ok?'});
    bs.showBusy();
    try {
      await d(login(values));
      nav('/dashboard');
    } finally {
      bs.hideBusy();
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card
      style={{
        maxWidth: 600,
        width: '100%'
      }}
      title="Login"
    >
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        layout='vertical'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            // offset: 8,
            // span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            // offset: 8,
            // span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Home;