import { useAppSelector } from "@/store/hooks";
import History from "./History";

const Page = () => {
  const user = useAppSelector((s) => s.auth.user)

  return (<History
    defaultParams={{
      affiliateId: user.userName,
      scratchCardType: 'AFFILIATE'
    }}
    hideScratchCardType
  />)
}

export default Page;