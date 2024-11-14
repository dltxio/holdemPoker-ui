import { useAppDispatch } from "@/store/hooks";
import dayjs from "@/core/dayjs";
import RakeCommissionChartView from "../components/RakeCommissionReportChart";
import { generateDailyRakeChart } from "../store/action";

const Page = () => {
  const d = useAppDispatch();
  const load = async (values: any) => {
    const { payload: res } = await d(generateDailyRakeChart({
      addeddate: dayjs(values.date).valueOf()
    }));
    console.log("payload: ", res);
    const data = [];
    if(res.success && ((res.currentMonthRakeData && res.currentMonthRakeData.length > 0) || (res.previousMonthRakeData && res.previousMonthRakeData.length > 0))){
      // swal("Success!", "Data Retreived  successfully.");
      // for(var i = 0; i<res.result.currentMonthRakeData.length;i++){
      let  j = 1;
      for (let i = res.currentMonthRakeData.length - 1; i >= 0; i--){
        let tempObj: any = {};
        tempObj.value = res.currentMonthRakeData[i].dailyAllRake;
        tempObj.label = dayjs(res.currentMonthRakeData[i].date).date();
        if(res.result.previousMonthRakeData[i]){
          tempObj.dailyRakePrevMonth = res.result.previousMonthRakeData[i].dailyAllRake;
        }
        j = j + 1;
        data.push(tempObj);
      }
    }
    return data.sort((a, b) => a.label - b.label);
  }
  return (
    <RakeCommissionChartView
      title="DAILY RAKE COMMISSION CHART"
      loadData={load}
    />
  )
};

export default Page;