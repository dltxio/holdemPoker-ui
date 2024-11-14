import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { useBusyContext } from "@/components/shared/busy";
import { Heading } from "@/components/shared/heading/Heading";
import { useAppDispatch } from "@/store/hooks";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router";
import { Checkbox, Form, Input, InputNumber, Select } from 'antd';
import "./HighRollers.scss";
import DatePicker from "@/components/antd/DatePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/lib/input/TextArea";
import clsx from "clsx";
import { useConfirmationContext } from "@/components/shared/confirmation";
import { showAlert } from "@/store/global/action";
import { createScratchCardHighRollers } from "../../store/action";
import dayjs from "dayjs";
import { getCurrentUserData } from "@/helpers/common";
import { ICreatedBy } from "@/modules/user/interfaces/CreateAgent.interface";
const HighRollers = () => {
    const d = useAppDispatch();
    const nav = useNavigate();
    const bs = useBusyContext();
    const cf = useConfirmationContext();

    const [form] = Form.useForm();
    const [data, setData] = useState<any>({});

    const handleFieldsChange = (fields: any) => {
        data[fields[0].name[0]] = fields[0];
        setData({ ...data });
    }

    const handleSubmit = async (values: any) => {
        await cf.showConfirm({
            message: 'Are you sure you want to create the Scratch Card?'
        })
        try {
            bs.showBusy();
            const currentUser = getCurrentUserData();
            const createdBy: ICreatedBy = {
                name: currentUser.name,
                userName: currentUser.userName,
                role: currentUser.role,
                id: currentUser.email
            };

            const date = new Date(values.expiresOn)
            const res = await d(createScratchCardHighRollers({
                ...values,
                expiresOn: Number(date.setDate(date.getDate() + 1)) - 1000,
                isActive: true,
                createdBy,
                scratchCardType: "HIGH-ROLLERS"
            }));
            console.log(res.payload.info);
            if (res.payload?.status === 200) {
                d(showAlert({ title: `Scratch card created successfully.` }))
                // form.resetFields();
            } else {
                d(showAlert({ title: res.payload.info }))
            }

        } finally {
            bs.hideBusy();
        }
    }
    const disabledDate = (current: any) => {
        // Can not select days before today and today
        return !dayjs(current).isToday() && dayjs().isAfter(dayjs(current));
    };
    return (
        <Fragment>
            <div className="high-roller-content">
                <Breadcrumb />

                <div className="high-roller-content__wrapper">
                    <Heading
                        title="HIGH ROLLERS"
                    />
                    <div className="high-roller-content__form mt-3">
                        <Form
                            form={form}
                            labelCol={{
                                md: 10
                            }}
                            onFinish={handleSubmit}
                            onFieldsChange={handleFieldsChange}
                        >
                            <div className="form-item">
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item
                                            name='playerId'
                                            className='mb-0'
                                            label="Player ID"
                                            requiredMark='optional'
                                            rules={[{ required: true, message: 'Please provide a valid player ID.' }]}
                                        >
                                            <Input
                                                type="text"
                                                className="form-control"
                                                placeholder="Player ID"
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="form-item">
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item
                                            name='totalAmount'
                                            className='mb-0'
                                            label="Bonus Amount"
                                            requiredMark='optional'
                                            rules={[{ required: true, message: 'Please provide valid bonus amount.' }]}
                                        >
                                            <InputNumber
                                                type="text"
                                                className="form-control"
                                                placeholder="Bonus Amount"
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="form-item">
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item
                                            name='expiresOn'
                                            className='mb-0'
                                            label="Expires On"
                                            requiredMark='optional'
                                            rules={[{ required: true, message: 'Please provide valid Expires On.' }]}
                                        >
                                            <DatePicker
                                                disabledDate={disabledDate}
                                                className="default form-control"
                                                suffixIcon={<FontAwesomeIcon icon={faCalendarDays} />}
                                                allowClear={false}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="form-item">
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item
                                            name='transactionType'
                                            className='mb-0'
                                            label="Transaction type"
                                            requiredMark='optional'
                                            rules={[{ required: true, message: 'Please provide valid Transaction type.' }]}
                                        >
                                            <Select
                                                className="default"
                                                placeholder="Please select"
                                                options={[
                                                    { label: 'Debit', value: 'Debit' },
                                                    { label: 'Credit', value: 'Credit' }
                                                ]}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="form-item">
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item
                                            name='comment'
                                            className='mb-0'
                                            label="Comment"
                                            requiredMark='optional'
                                            rules={[{ required: true, message: 'Please fill this field.' }]}
                                        >
                                            <TextArea
                                                placeholder="Max. 225 characters."
                                                maxLength={255}
                                                rows={4}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="form-buttons">
                                <div className="row">
                                    <div className="col-md-9 offset-md-3">
                                        <button type="button" className="btn grey" onClick={() => nav('/dashboard')}>Cancel</button>
                                        <button type="submit" className={clsx('btn', 'info')}>Submit</button>
                                    </div>
                                </div>
                            </div>

                        </Form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
};

export default HighRollers;