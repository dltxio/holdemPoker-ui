import { useEffect } from "react"
import { useConfirmationContext } from "."

export function DefaultLoader() {
  const cf = useConfirmationContext();
  useEffect(() => {
    if (window && cf.isShow) {
      if (window.confirm(cf.message)) {
        cf.ok();
      } else {
        cf.cancel();
      }
    }
    return () => {}
  }, [cf.isShow]);

  return (null);
}