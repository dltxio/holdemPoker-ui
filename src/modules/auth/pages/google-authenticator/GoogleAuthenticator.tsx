import { Fragment, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router';
import { googleAuthenSecretKey, getSecretKeyGoogleAuthen, verifyGoogleAuthenCode, saveLocalUser, removeLocalUser } from '@/modules/auth/store/action';
import { useAppDispatch } from '@/store/hooks';

import './GoogleAuthenticator.scss';
import { showAlert } from '@/store/global/action';
import { IAlertData } from '@/interfaces/global.interface';
import cache from '@/core/cache';
import { LOCAL_USER_KEY } from '@/configs/auth.config';
import QRCode from 'qrcode.react';

export const getLocalUser = () => cache.getCache(LOCAL_USER_KEY)

const GoogleAuthenticator = () => {
    const d = useAppDispatch(); 
    const nav = useNavigate();
    const [isQr, setIsQr] = useState(false);
    const [isQRCode, setIsQRCode] = useState("");
    
    useEffect(() => {
        getSecretKey();
    }, [])

    const getSecretKey = async () => {
        const localUser = getLocalUser();
        const res: any = await d(googleAuthenSecretKey({ userName: localUser?.data?.userName }));
        const resData = res.payload.data.result;
        if (resData) {
            if (resData.countGoogleAuthen === 0 || !resData.countGoogleAuthen) {
                const getSecretKey = await d(getSecretKeyGoogleAuthen({ userName: localUser?.data?.userName }));
                if (getSecretKey.payload.data) {
                    let secretKey = getSecretKey.payload.data.result.secret;
                    qrCode("Texas Holdl", secretKey, "pokerholdm1");
                    setIsQr(true);
                }
            } else {
                setIsQr(false);
            }
        }
    } 

    const qrCode = (appName: string, secret: string, issuer: string) => {
        var secretURL = 'otpauth://totp/' + appName + '?secret=' + secret + '&issuer=' + issuer + '';
        setIsQRCode(encodeURI(secretURL))
    };

    const onFinish = async (values: any) => {
        if (
        !values ||
        !values.code ||
        values.code.trim() === ''
        ) {
        const error: IAlertData = {
            title: 'Error!',
            content: 'Insufficient info!'
        }
        d(showAlert(error));
        } else {
            const localUser = getLocalUser();
            const res = await d(verifyGoogleAuthenCode({ ...values, userName: localUser?.data?.userName }));
            const resData = res.payload.data.result;
            if (resData.status === 200) {
                const dataLogin = {
                    ...localUser?.data,
                    isLogin: true
                }
                removeLocalUser()
                saveLocalUser(dataLogin);
                // localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(dataLogin));
                window.location.href = "/dashboard";
            } else {
                d(showAlert({ title: 'error', content: "Google Authenticator code incorrect" }));
            }
        }
    }

    const onFinishFailed = () => {

    }

    return (
        <Fragment>
            <div className="login-content">
                <h3>Google Authenticator</h3>
                
                {isQr ? (
                    <Form
                        className="default"
                        initialValues={{ remember: true, code: '' }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete='off'
                    >
                        <QRCode value={isQRCode} style={{ height: "170px", width: "170px", marginLeft: "335px", marginBottom: "13px", marginTop: "10px" }} />
                        <Form.Item
                            name='code'
                        >
                            <Input
                                placeholder="Google Authenticator Code"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type='primary' htmlType='submit'>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                ): (
                    <Form
                        className="default"
                        initialValues={{ remember: true, code: '' }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete='off'
                    >
                        <Form.Item
                            name='code'
                        >
                            <Input
                                placeholder="Google Authenticator Code"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type='primary' htmlType='submit'>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </div>
        </Fragment>
    );
}

export default GoogleAuthenticator;