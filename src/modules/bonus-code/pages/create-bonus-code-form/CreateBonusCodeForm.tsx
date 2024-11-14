import DatePicker from "@/components/antd/DatePicker";
import { useBusyContext } from "@/components/shared/busy";
import { useConfirmationContext } from "@/components/shared/confirmation";
import { getCurrentUserData } from "@/helpers/common";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import clsx from "clsx";
import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BonusCategories, BonusCategoriesEnum, BonusCodeActionEnum, BonusCodeTypes, Loyalityvalues } from "../../models/CreateBonusCode";
import { createBonusCode, updateBonusCode } from "../../store/action";
import "./CreateBonusCodeForm.scss"
type Props = {
    action: string;
    initialValues?: any;
    resetText?: string;
    submitText?: string;
}
const CreateBonusCodeForm: React.FC<Props> = ({
    action = BonusCodeActionEnum.create,
    initialValues,
    resetText = 'Reset',
    submitText = 'Submit',
}) => {
    const d = useAppDispatch();
    const nav = useNavigate();
    const bs = useBusyContext();
    const cf = useConfirmationContext();

    const [form] = Form.useForm();
    const [bonusCodeCategory, setBonusCodeCategory] = useState('');

    const handleSubmit = async (values: any) => {
        if (action === BonusCodeActionEnum.create) {
            handleCreate(values);
        } else {
            handleUpdate(values);
        }
    }

    const handleCreate = async (values: any) => {
        try {
            bs.showBusy()
            const params = initParams(values);
            const res = await d(createBonusCode(params));
            if (res.payload?._id) {
                d(showAlert({
                    content: 'Bonus code created successfully.',
                    title: 'Success!'
                }));
                handleReset();
            } else {
                d(showAlert({
                    title: 'Error!',
                    content: res.payload?.info || 'Getting error from server'
                }))
            }
        } catch (e) {
            console.log(e);
            d(showAlert({
                title: 'Error!',
                content: 'Getting error from server'
            }))
        } finally {
            bs.hideBusy()
        }
    }
    const initParams = (values: any) => {
        const currentUser = getCurrentUserData();
        const profile = {
            ...currentUser.role
        };
        let params = {
            ...values,
            validTill: values.validTill.valueOf(),
            profile,
            status: "Live",
            createdAt: (new Date()).valueOf(),
            createdBy: currentUser.userName
        }
        if (values.bonusCodeCategory) {
            let cat = BonusCategories.find(x => x.value === values.bonusCodeCategory);
            params.bonusCodeCategory = {
                name: cat?.label,
                type: cat?.value
            }
        }
        if (values.bonusCodeType) {
            const type = BonusCodeTypes.find(x => x.value === values.bonusCodeType)
            params.bonusCodeType = {
                name: type?.label,
                type: type?.value
            }
        }
        if (values.loyalityLevel) {
            const loyalityLevel = Loyalityvalues.find(x => x.value === values.loyalityLevel)
            params.loyalityLevel = {
                level: loyalityLevel?.value,
                name: loyalityLevel?.label
            }
        }
        return params;
    }
    const handleUpdate = async (values: any) => {
        try {
            bs.showBusy()
            const currentUser = getCurrentUserData();
            const updatedByRole = {
                ...currentUser.role
            };
            let params = {
                ...values,
                validTill: values.validTill.valueOf(),
                updatedBy: currentUser.userName,
                updatedByRole,
                _id: initialValues.id
            }
            const res = await d(updateBonusCode(params));
            if (res.payload?.success) {
                d(showAlert({
                    content: 'Bonus code updated successfully.',
                    title: 'Success!'
                }));
                nav('/listBonusDeposit')
            } else {
                d(showAlert({
                    title: 'Error!',
                    content: res.payload?.info || 'Getting error from server'
                }))
            }
        } catch (e) {
            console.log(e);
            d(showAlert({
                title: 'Error!',
                content: 'Getting error from server'
            }))
        } finally {
            bs.hideBusy()
        }
    }
    const handleReset = () => {
        form.resetFields();
        setBonusCodeCategory('')
        form.setFieldValue('bonusCodeCategory', undefined);
        form.setFieldValue('lockedBonusPercent', undefined);
        form.setFieldValue('instantCap', undefined);
        form.setFieldValue('lockedCap', undefined);
        form.setFieldValue('bonusCodeType', undefined);
    }
    const handleback = () => {
        nav('/listBonusDeposit')
    }
    const handleChangeCategory = (value: string) => {
        setBonusCodeCategory(value);
    }
    useEffect(() => {
        console.log(initialValues);
        if (initialValues) {
            form.setFieldValue('codeName', initialValues.codeName);
            form.setFieldValue('validTill', dayjs(initialValues.validTill));
            form.setFieldValue('tag', initialValues.tag);
            form.setFieldValue('tagDescription', initialValues.tagDescription);
        }

    }, [initialValues])
    return (
        <Fragment>
            <Form
                form={form}
                labelCol={{
                    md: 10
                }}
                onFinish={handleSubmit}
                disabled={action === BonusCodeActionEnum.view}
                initialValues={
                    initialValues
                }
            >
                <div className="form-item">
                    <div className="row">
                        <div className="col-md-9">
                            <Form.Item
                                name='codeName'
                                label="Bonus Code Name"
                                requiredMark='optional'
                                rules={[{ required: true, message: 'Please provide a valid Bonus Code name.' }]}
                            >
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Leaderboard Name"
                                    onInput={(e: any) => e.target.value = e.target.value.toUpperCase()}
                                    disabled={action === BonusCodeActionEnum.edit}
                                />
                            </Form.Item>
                        </div>
                        {
                            action === BonusCodeActionEnum.create && <Fragment>

                                <div className="col-md-9">
                                    <Form.Item
                                        name='bonusCodeCategory'
                                        label="Bonus Code Category"
                                    >
                                        <Select
                                            className="form-control"
                                            placeholder="Please select"
                                            options={BonusCategories}
                                            onChange={handleChangeCategory}
                                        />
                                    </Form.Item>
                                </div>
                                {
                                    (bonusCodeCategory === BonusCategoriesEnum.instantBonus || bonusCodeCategory === BonusCategoriesEnum.both) &&
                                    <div className="col-md-9">
                                        <Form.Item
                                            name='instantBonusPercent'
                                            label="Instant Bonus Percent"
                                        >
                                            <InputNumber />
                                        </Form.Item>
                                    </div>
                                }
                                {
                                    (bonusCodeCategory === BonusCategoriesEnum.lockedBonus || bonusCodeCategory === BonusCategoriesEnum.both) &&
                                    <div className="col-md-9">
                                        <Form.Item
                                            name='lockedBonusPercent'
                                            label="Locked Bonus Percent"
                                        >
                                            <InputNumber />
                                        </Form.Item>
                                    </div>
                                }
                                {
                                    (bonusCodeCategory === BonusCategoriesEnum.instantBonus || bonusCodeCategory === BonusCategoriesEnum.both) &&
                                    <div className="col-md-9">
                                        <Form.Item
                                            name='instantCap'
                                            label="Instant Cap Amount"
                                        >
                                            <InputNumber />
                                        </Form.Item>
                                    </div>
                                }
                                {
                                    (bonusCodeCategory === BonusCategoriesEnum.lockedBonus || bonusCodeCategory === BonusCategoriesEnum.both) &&
                                    <div className="col-md-9">
                                        <Form.Item
                                            name='lockedCap'
                                            label="Locked Cap Amount"
                                        >
                                            <InputNumber />
                                        </Form.Item>
                                    </div>
                                }
                                <div className="col-md-9">
                                    <Form.Item
                                        name='bonusCodeType'
                                        label="Bonus Code Type"
                                    >
                                        <Select
                                            className="form-control"
                                            placeholder="Please select"
                                            options={BonusCodeTypes}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="col-md-9">
                                    <Form.Item
                                        name='minAmount'
                                        label="Min. Amount"
                                    >
                                        <InputNumber min={0} />
                                    </Form.Item>
                                </div>
                                {
                                    bonusCodeCategory !== BonusCategoriesEnum.leaderboardEntry &&
                                    <div className="col-md-9">
                                        <Form.Item
                                            name='maxAmount'
                                            label="Max. Amount"
                                        >
                                            <InputNumber min={0} />
                                        </Form.Item>
                                    </div>
                                }
                            </Fragment>
                        }
                        <div className="col-md-9">
                            <Form.Item
                                name='validTill'
                                label="Valid Till"
                            >
                                <DatePicker />
                            </Form.Item>
                        </div>

                        {action === BonusCodeActionEnum.create && <div className="col-md-9">
                            <Form.Item
                                name='loyalityLevel'
                                label="Min. Loyality Level"
                            >
                                <Select
                                    className="form-control"
                                    placeholder="Please select"
                                    options={Loyalityvalues}
                                />
                            </Form.Item>
                        </div>}


                        <div className="col-md-9">
                            <Form.Item
                                name='tag'
                                label="Tag"
                            >
                                <TextArea placeholder="Max .255 characters"/>
                            </Form.Item>
                        </div>
                        <div className="col-md-9">
                            <Form.Item
                                name='tagDescription'
                                label="Tag Description"
                            >
                                <TextArea placeholder="Max .500 characters"/>
                            </Form.Item>
                        </div>
                    </div>
                </div>

                <div className="form-buttons">
                    <div className="row">
                        <div className="btn-center">
                            {action !== BonusCodeActionEnum.view && <Fragment>
                                <button type="submit" className={clsx('btn', 'info')}>{submitText}</button>
                                <button type="button" className="btn grey" onClick={handleback}>{resetText}</button>
                            </Fragment>}
                            {action === BonusCodeActionEnum.view && <button type="button" onClick={handleback} className={clsx('btn', 'info')}>{submitText}</button>}
                        </div>
                    </div>
                </div>
            </Form>

        </Fragment>
    )
}

export { CreateBonusCodeForm }