import DatePicker from "@/components/antd/DatePicker";
import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { useBusyContext } from "@/components/shared/busy";
import { Button } from "@/components/shared/button/Button";
import { Heading } from "@/components/shared/heading/Heading";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { Form, FormInstance, Input } from "antd";
import { Fragment, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { dailyCashoutChart } from "../../store/action";
import "./DailyCashoutChart.scss";
const options = {
    plugins: {
        tooltip: {
            callbacks: {
                label: function (context: any) {
                    return `Cashout on ${context.label}: ${context.parsed.y}`;
                },
                title: () => {
                    return ``;
                }
            }
        },
        legend: {
            display: false
        }
    }
}
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const Page = () => {
    const dispatch = useAppDispatch();
    const busy = useBusyContext();
    const formRef = useRef<FormInstance>(null);
    const chartRef = useRef(null);
    const [data, setData] = useState<any>(null);

    const handleSubmit = async (values: any) => {
        if (!values?.addeddate) {
            return;
        }
        try {
            busy.showBusy();
            const res: any = await dispatch(dailyCashoutChart({
                ...values,
                addeddate: values?.addeddate?.valueOf()
            }));
            if (res.payload) {
                dispatch(showAlert({
                    title: 'Success!',
                    content: 'Data Retreived  successfully.'
                }))
                const chartData = res.payload.result;

                let dataList = [];
                let j = 1;
                for (let i = chartData.currentMonthCashoutData.length - 1; i >= 0; i--) {
                    let tempObj: any = {};
                    tempObj.dailyCashoutCurrentMonth = chartData.currentMonthCashoutData[i].dailyCashout;
                    tempObj.day = j;
                    j = j + 1;
                    dataList.push(tempObj);
                }
                setData({
                    datasets: [
                        {
                            label: 'Cashout',
                            data: dataList.map((x: any) => x.dailyCashoutCurrentMonth),
                            barThickness: 25,
                            maxBarThickness: 25,
                            backgroundColor: '#32c5d2'
                        }
                    ],
                    labels: dataList.map((x: any) => x.day)
                })

            } else {
                setData(null)
                dispatch(showAlert({
                    title: 'Error!',
                    content: 'No data of leaderboard found.'
                }))
            }
            formRef.current?.resetFields();
        } finally {
            busy.hideBusy();
        }
    }

    return (
        <Fragment>
            <div className="daily-cashout-content">
                <Breadcrumb />

                <Heading
                    title="DAILY CASHOUT CHART"
                    type="info"
                    solid={true}
                />

                <div className="daily-cashout-content__wrapper">
                    <Form
                        ref={formRef}
    
                        onFinish={handleSubmit}
                        {...layout}
                    >
                        <div className="form-content">
                            <div className="row">
                                <div className="col-md-12">

                                    <Form.Item
                                        name={'addeddate'}
                                        label="Month"

                                    >
                                        <DatePicker placeholder="" />
                                    </Form.Item>
                                    <span className="chart-message">*The chart only shows entries for successful cashout.</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-buttons d-flex">
                                        <Button
                                            htmlType='submit'
                                            text="Submit"
                                            type="info"
                                            icon="bi-pencil-square"
                                            solid={true}
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>

                    {data && <div>
                        <Bar
                            data={data}
                            ref={chartRef}
                            options={options}
                        />
                    </div>}
                </div>
            </div>

        </Fragment>
    )
};

export default Page;