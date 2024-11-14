import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { Heading } from "@/components/shared/heading/Heading";
import { title } from "process";
import { Fragment } from "react";

const page = () => {
    return (
        <Fragment>
            <div className="bonus-transfer-content">
                <Breadcrumb />

                <div className="bonus-transfer-content__wrapper">
                    <Heading
                        title={title}
                        icon="bi-gear"
                        type="info"
                    />
                    <div className="bonus-transfer-content__form mt-3">
                    </div>
                </div>
            </div>
        </Fragment>
    )
};

export default page;