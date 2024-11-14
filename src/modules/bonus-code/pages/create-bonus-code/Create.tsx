import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { Heading } from "@/components/shared/heading/Heading";
import { Fragment } from "react";
import { BonusCodeActionEnum } from "../../models/CreateBonusCode";
import { CreateBonusCodeForm } from "../create-bonus-code-form/CreateBonusCodeForm";
import "./Create.scss";
const Create = () => {
  return (
    <>
      <Fragment>
        <div className="create-bonus-code-content">
          <Breadcrumb />

          <div className="create-bonus-code-content__wrapper">
            <Heading
              title="GENERATE CODE"
              type="info"
              solid={true}
            />
            <CreateBonusCodeForm action={BonusCodeActionEnum.create} resetText={'Cancel'}/>

          </div>
        </div>
      </Fragment>
    </>
  )
};

export default Create;