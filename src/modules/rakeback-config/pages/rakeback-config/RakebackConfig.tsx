import { Fragment, useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import { CheckboxList } from '@/components/shared/checkbox-list/CheckboxList';
import { PageTitle } from '@/components/shared/page-title/PageTitle';
import { useBusyContext } from '@/components/shared/busy';

// Constants
import { ROOT } from '@/constants';

// Helpers
import { getRoleParam, toStringArray } from '@/helpers/common';

// Actions
import { listRakeBack, editRakeback  } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Interfaces

import './RakebackConfig.scss'

const Page = () => {
    const busyContext = useBusyContext();
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const [data, setData] = useState<any>(null);

    const [form] = Form.useForm();


    const handleSubmit = async (values: any) => {

        const params = {
            toAdminPercent : Number(values.toAdminPercent),
            to1stLinePercent : Number(values.to1stLinePercent),
            to2ndLinePercent : Number(values.to2ndLinePercent),
            target1stLine : values.target1stLine,
            target2ndLine : values.target2ndLine,
            timeDurationCycle : values.timeDurationCycle,
            daysOfWeek : values.daysOfWeek,
            hours : values.hours,
            minutes : values.minutes
        }
        
        console.log("params: ", params);
        try {
          busyContext.showBusy();
          const res: any = unwrapResult(await dispatch(editRakeback(params)));
          dispatch(showAlert({ content: res.message }, 'success'));
        } catch (e: any) {
          dispatch(showAlert({ content: e.message }, 'error'));
        } finally {
          busyContext.hideBusy();
        }
    }

    const fetchData = async () => {
        try {
        const res = await dispatch(listRakeBack());
            setData(res.payload[0]);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Fragment>
            <div className="edit-user-content">
                <PageTitle
                    text="Rakeback Config"
                    mode="bold"
                    type="danger"
                    icon="bi-gear"
                />

                {data && (
                    <div className="form">
                        <Form
                            layout="vertical"
                            autoComplete="off"
                            onFinish={handleSubmit}
                            form={form}
                            initialValues={{
                                toAdminPercent: data.toAdminPercent,
                                to1stLinePercent: data.to1stLinePercent,
                                to2ndLinePercent: data.to2ndLinePercent,
                                target1stLine: data.target1stLine,
                                target2ndLine: data.target2ndLine,
                                timeDurationCycle: data.timeDurationCycle,
                                daysOfWeek: data.daysOfWeek,
                                hours: data.hours,
                                minutes: data.minutes
                            }}
                        >
                            <Form.Item
                                label="Rake to Admin"
                                name="toAdminPercent"
                                rules={[
                                    { required: true, message: 'Please enter valid Rake to Admin.' },
                                ]}
                            >
                                <Input
                                    placeholder="Rake to Admin"
                                    className="default"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Rakeback to 1st Line Player"
                                name="to1stLinePercent"
                                rules={[
                                    { required: true, message: 'Please enter valid Rakeback to 1st Line Player.' },
                                ]}
                            >
                                <Input
                                    placeholder="Rakeback to 1st Line Player"
                                    className="default"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Rakeback to 2nd Line Player"
                                name="to2ndLinePercent"
                                rules={[
                                    { required: true, message: 'Please enter valid Rakeback to 2nd Line Player.' },
                                ]}
                            >
                                <Input
                                    className="default"
                                    placeholder="Rakeback to 2nd Line Player"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Rake target for 1st Line Player"
                                name="target1stLine"
                                rules={[
                                    { required: true, message: 'Rake target for 1st Line Player is required.' },
                                ]}
                            >
                                <Input
                                    className="default"
                                    placeholder="Rake target for 1st Line Player"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Rake target for 2nd Line Player"
                                name="target2ndLine"
                                rules={[
                                    { required: true, message: 'Please enter valid user name.' },
                                ]}
                            >
                                <Input
                                    placeholder="Rake target for 2nd Line Player"
                                    className="default"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Time Duration for Rakeback Cycle"
                            >
                                            
                                <Form.Item
                                    label="Value from 0 to 59"
                                    name="minutes"
                                >
                                    <Input
                                        placeholder="Minutes"
                                        className="default"
                                    />
                                </Form.Item>
                                            
                                <Form.Item
                                    label="Value from 0 to 23"
                                    name="hours"
                                >
                                    <Input
                                        placeholder="hours"
                                        className="default"
                                    />
                                </Form.Item>
                                            
                                <Form.Item
                                    label="Value from 0 to 6. 0 is Sunday"
                                    name="daysOfWeek"
                                >
                                    <Input
                                        placeholder="Days of week"
                                        className="default"
                                    />
                                </Form.Item>
                                                
                            </Form.Item>
                                    
                            <div className="form-buttons">
                                <div className="row">
                                    <div className="offset-md-3 col-md-9 col-sm-12">
                                        <Form.Item shouldUpdate>
                                            {() => (
                                            <button
                                                type="submit"
                                                className={clsx('btn', 'primary')}
                                                disabled={form.getFieldsError().filter(({ errors }) => errors.length).length > 0}
                                            >Submit</button>
                                            )}
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