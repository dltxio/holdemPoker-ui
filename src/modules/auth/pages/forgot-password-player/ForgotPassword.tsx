import { Fragment, useEffect, useState  } from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router';
import { resetPasswordPlayer, checkTokenResetExpried } from '@/modules/auth/store/action';
import { useAppDispatch } from '@/store/hooks';

import './ForgotPassword.scss';
import { showAlert } from '@/store/global/action';
import { IAlertData } from '@/interfaces/global.interface';
import { useBusyContext } from "@/components/shared/busy";

const ForgotPassword = () => {
    const d = useAppDispatch();
    const nav = useNavigate();
    const bs = useBusyContext();
    const [token, setToken] = useState("");
    const [isExpried, setIsExpried] = useState(true);

    const checkTokenExpired = async (token: string) => {
        const data = {
            token: token,
        }
        const isTokenExpired = await d(checkTokenResetExpried(data));
        if (isTokenExpired.payload.data.result.success === true) {
            setIsExpried(true);
        } else {
            setIsExpried(false);
        }
    }
    
    useEffect(() => {
        const currentUrl = window.location.href;
        const tokenURl = currentUrl.split("/")[4]
        checkTokenExpired(tokenURl);
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
            const res = await d(resetPasswordPlayer(data));
            if (res.payload.data.success) {
                // window.location.href = "http://localhost/poker-website/"
                // window.location.href = "https://holdempoker.pokermoogley.com/",
                window.location.href = "https://texashodl.net/"
            } else {
                
            }
        
        }
    }

    const onFinishFailed = () => {

    }

    return (
        <Fragment>
            <div className="login-content">
                <h3>RESET PASSWORD PLAYER</h3>
                {isExpried === true ? (
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
                ) : (
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
                                placeholder="The password change link has expired"
                                value={"The password change link has expired"}
                                disabled
                            />
                        </Form.Item>

                    </Form>
                )}
            </div>
        </Fragment>
    );
}

export default ForgotPassword;