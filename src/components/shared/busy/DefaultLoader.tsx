import { useBusyContext } from "."
import { Loading } from "../loading/Loading";
import './DefaultLoader.scss';

export function DefaultLoader() {
  const bs = useBusyContext();
  return bs.isShow ? (
    <div className="loader-wrapper">
      <Loading/>
      {/* <div className="text">Loading...</div> */}
    </div>
  ) : (null)
}