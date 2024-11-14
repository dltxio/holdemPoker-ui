import { Fragment } from "react";

const CustomInnerHtml = ({ value }: any) => {
    return (
        <Fragment>{ value?<span dangerouslySetInnerHTML = {{ __html: value } } >
        </span > : 'N/A'}</Fragment>
    )
}

export default CustomInnerHtml;