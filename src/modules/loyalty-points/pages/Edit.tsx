import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb"
import { CustomBreadcrumb } from "@/components/shared/customBreadcrumb/CustomBreadcrumb"
import { Heading } from "@/components/shared/heading/Heading"
import { useAppDispatch } from "@/store/hooks"
import { Fragment, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
// import { BonusCodeActionEnum } from "../../models/CreateBonusCode";
import { listLoyaltyPoints } from "../store/action"
import CreateLoyaltyPointForm from "../pages/create-loyalty-point-form/CreateLoyaltyPointForm"
import "../../bonus-code/pages/edit-bonus-code/Edit.scss"
const Edit = () => {
  const nav = useNavigate()
  const params = useParams()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>({})

  useEffect(() => {
    if (params.id)
      getDetail(params.id)
  }, [params])

  const getDetail = async (id: string) => {
    const res = await dispatch(listLoyaltyPoints({
      _id: id,
    }))
    if (res.payload.length > 0) {
      const deposit = res.payload[0]
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
          <CustomBreadcrumb modules={['Loyalty Points Management','Loyalty Points', 'Edit Loyalty Level' ]} />
          <div className="create-bonus-code-content__wrapper">
            <Heading
              title="EDIT LOYALTY POINTS"
              type="info"
              solid={true}
            />
            {/* <CreateLoyaltyPointForm action={BonusCodeActionEnum.edit} resetText={'Cancel'} initialValues={data}/> */}
            <CreateLoyaltyPointForm initialValue={data} />
          </div>
        </div>
      </Fragment>
    </>
  )
};

export default Edit;