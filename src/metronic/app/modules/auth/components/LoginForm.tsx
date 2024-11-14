import { login } from "@/modules/auth/store/action";
import { useAppDispatch } from "@/store/hooks";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router";

export const LoginForm = () => {
  const d = useAppDispatch();
  const nav = useNavigate();

  const onFinish = async (values: any) => {
    const res = await d(login(values));
    nav('/dashboard')
  }

  const onFinishFailed = () => {

  }

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true, userName: 'Admin', password: '3EAz0dkG' }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className='form w-100'
    >
      <Form.Item
        label="Username"
        name="userName"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}