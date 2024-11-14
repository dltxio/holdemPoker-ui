import { Fragment, useEffect, useState  } from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router';
import { resetPassword, checkTokenResetExpried } from '@/modules/auth/store/action';
import { useAppDispatch } from '@/store/hooks';

import './NewPassword.scss';
import { showAlert } from '@/store/global/action';
import { IAlertData } from '@/interfaces/global.interface';
import { useBusyContext } from "@/components/shared/busy";

const NewPassword = () => {
    const d = useAppDispatch();
    const nav = useNavigate();
    const bs = useBusyContext();
    const [token, setToken] = useState("");

    useEffect(() => {
        const currentUrl = window.location.href;
        const tokenURl = currentUrl.split("/")[4]
        setToken(tokenURl)
      }, []);

    const onFinish = async (values: any) => {
        if (
            !values ||
            !values.passwordPlayer ||
            !values.newPasswordPlayer ||
            values.passwordPlayer.trim() === '' ||
            values.newPasswordPlayer.trim() === ''
        ) {
            const error: IAlertData = {
                title: 'Error!',
                content: 'Insufficient info!'
            }
            d(showAlert(error));
        } else {
            const data = {
                password: values.passwordPlayer,
                newPassword: values.newPasswordPlayer,
                id:token
            }
            const res = await d(resetPassword(data));
            if (res.payload.data.success) {
                // window.location.href = "http://localhost/poker-website/"
                // window.location.href = "https://holdempoker.pokermoogley.com/",
                window.location.href = "/"
            } else {
                
            }
        
        }
    }

    const onFinishFailed = () => {

    }

    return (
        <Fragment>
            <div className="login-content">
                <h3>RESET PASSWORD</h3>
                <Form
                    className="default"
                    //   initialValues={{ remember: false, userName: 'Admin', password: 'adminpassword' }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete='off'
                >
                    <Form.Item
                        name='passwordPlayer'
                    >
                        <Input
                            placeholder="Enter New Password"
                        />
                    </Form.Item>

                    <Form.Item
                        name='newPasswordPlayer'
                    >
                        <Input
                            //   visibilityToggle={false}
                            placeholder="Confirm Password"
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

export default NewPassword;