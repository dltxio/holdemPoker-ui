import { formatNumber } from "@/helpers/number";
import { useMemo } from "react"

type DisplayNumberProps = {
  value: number;
}
const DisplayNumber = ({value}: DisplayNumberProps) => {
  const formated = useMemo(() => {
    return formatNumber(value);
  }, [value])
  return (
    <>{formated}</>
  )
}

export default DisplayNumber;