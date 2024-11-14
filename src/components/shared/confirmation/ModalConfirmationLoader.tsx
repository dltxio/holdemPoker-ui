import { Form, FormInstance, Input, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useRef, useState } from "react"
import { useConfirmationContext } from "."
import './ModalConfirmationLoader.scss';

const IconMaps = {
  'info': 'text-info',
  'default': '',
  'error': 'text-danger',
  'warning': 'text-warning',
  'success': 'text-success',
}

export function ModalConfirmationLoader() {
  const cf = useConfirmationContext();
  const formref = useRef<FormInstance>(null);
  const [reason, setReason] = useState<any>({});
  // useEffect(() => {
  //   if (window && cf.isShow) {
  //     if (window.confirm(cf.message)) {
  //       cf.ok();
  //     } else {
  //       cf.cancel();
  //     }
  //   }
  //   return () => {}
  // }, [cf.isShow]);

  const classes = IconMaps[cf.options.type || 'default']

  const handleOK = () => {
    if (cf.options.showReason) {
      cf.ok(formref.current?.getFieldsValue());
    } else {
      cf.ok();
    }
  }

  return (
    <>
      <Modal
        open={cf.isShow}
        okText="OK"
        cancelText="Cancel"
        onCancel={cf.cancel}
        onOk={handleOK}
        className="confirmation-modal"
      >
        <div className="icon-wrap">
          <i className={"icon fa-info-circle fa " + classes}></i>
        </div>
        <div className="msg">{cf.message}</div>
        {cf.options.showReason && <Form ref={formref}>
          <Form.Item
            name={'reason'}
          >
            <TextArea
              cols={5}
              placeholder="Please enter the reason"
            >
            </TextArea>
          </Form.Item>
        </Form>}
      </Modal>
    </>
  );
}