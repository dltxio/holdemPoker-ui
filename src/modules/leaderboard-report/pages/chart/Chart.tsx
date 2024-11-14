import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { useBusyContext } from "@/components/shared/busy";
import { Button } from "@/components/shared/button/Button";
import { Heading } from "@/components/shared/heading/Heading";
import { LeaderboardTypesEnum } from "@/modules/leaderboard/models/Leaderboard";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { Form, FormInstance, Input } from "antd";
import { Fragment, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { listLeaderboardReport } from "../../store/action";
import "./Chart.scss";

const options = {
  plugins: {
      tooltip: {
          callbacks: {
              label: function (context: any) {
                  return `Leaderboard points of ${context.label}: ${context.parsed.y}`;
              },
              title: ()=>{
                  return ``;
              }
          }
      },
      legend:{
          display: false
      }
  }
}

const Page = () => {
  const dispatch = useAppDispatch();
  const busy = useBusyContext();
  const formRef = useRef<FormInstance>(null);
  const chartRef = useRef(null);
  const [data, setData] = useState<any>(null);

  const handleSubmit = async (values: any) => {
    const valid = await formRef.current?.validateFields();
    if (!valid) return;
    try {
      busy.showBusy();
      const res: any = await dispatch(listLeaderboardReport({
        ...values,
      }));
      if (res.payload?.length > 0) {

        const chartData = res.payload[0];
        if (chartData?.winnerDeclared) {
          let label = ''
          if (chartData.leaderboardType === LeaderboardTypesEnum.openVip || chartData.leaderboardType === LeaderboardTypesEnum.closedVip) {
            label = 'Leaderboard points'
          } else {
            label = 'Hands played'
          }
          const dataList = chartData.expectedWinners.splice(0, chartData.noOfWinners)
          setData({
            datasets: [
              {
                label,
                data: dataList.map((x: any) => x.total),
                barThickness: 25,
                maxBarThickness: 25,
                backgroundColor: '#32c5d2'
              }
            ],
            labels: dataList.map((x: any) => x._id.userName)
          })
        }
      } else {
        setData(null)
        dispatch(showAlert({
          title: 'Error!',
          content: 'No data of leaderboard found.'
        }))
      }


    } finally {
      busy.hideBusy();
    }
  }
  const onReset = () => {
    formRef.current?.resetFields();
    setData(null);
  }
  return (
    <Fragment>
      <div className="leaderboard-report-content">
        <Breadcrumb />

        <Heading
          title="LEADERBOARD CHART"
          type="info"
          solid={true}
          icon="bi-bar-chart"
        />

        <div className="leaderboard-report-content__wrapper">
          <Form
            ref={formRef}
            labelCol={{
              md: 10
            }}
            onFinish={handleSubmit}
          >
            <div className="row">
              <div className="col-md-3">

                <Form.Item
                  name={'leaderboardId'}
                >
                  <Input placeholder="Leaderboard Id" />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <div className="form-buttons d-flex">
                  <Button
                    htmlType='submit'
                    text="Submit"
                    type="info"
                    rounded={true}
                    icon="bi-pencil-square"
                    solid={true}
                  />

                  <Button
                    text="Reset"
                    type="info"
                    rounded={true}
                    onClick={onReset}
                    icon="bi-pencil-square"
                    solid={true}
                  />
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