import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { CustomBreadcrumb } from "@/components/shared/customBreadcrumb/CustomBreadcrumb";
import { Heading } from "@/components/shared/heading/Heading";
import { useAppDispatch } from "@/store/hooks";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { BonusCodeActionEnum } from "../../models/CreateBonusCode";
import { listBonusDeposit } from "../../store/action";
import { CreateBonusCodeForm } from "../create-bonus-code-form/CreateBonusCodeForm";
import "./Edit.scss";
const Edit = () => {
  const nav = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (params.id)
      getDetail(params.id)
  }, [params])

  const getDetail = async (id: string) => {
    const res = await dispatch(listBonusDeposit({
      _id: id,
      keyFromDashboard: 1
    }));
    if (res.payload.length > 0) {
      const deposit = res.payload[0];
      console.log(deposit)
      setData({
        id,
        ...deposit,
      })
    }
    setLoading(false)
  }

  return (
    <>
      <Fragment>
        <div className="create-bonus-code-content">
          {/* <Breadcrumb /> */}
          <CustomBreadcrumb modules={['Bonus Management','Edit Bonus Code Description']} />
          <div className="create-bonus-code-content__wrapper">
            <Heading
              title="EDIT DESCRIPTION"
              type="info"
              solid={true}
            />
            <CreateBonusCodeForm action={BonusCodeActionEnum.edit} resetText={'Cancel'} initialValues={data}/>

          </div>
        </div>
      </Fragment>
    </>
  )
};

export default Edit;