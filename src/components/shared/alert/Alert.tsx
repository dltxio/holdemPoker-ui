import React, { Fragment, useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { useAppSelector } from '@/store/hooks';
import { GLOBAL_EVENTS } from '@/constants';

import './Alert.scss';

type Props = {

}

const Alert: React.FC<Props> = () => {
  const { event } = useAppSelector(store => store.global);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (event && event.type) {
      switch (event.type) {
        case GLOBAL_EVENTS.SHOW_ALERT: {
          setIsModalOpen(true);
          setTitle(event.data.title);
          setContent(event.data.content);
          break;
        }
      }
    }
  }, [event]);

  return (
    <Fragment>
      <Modal
        open={isModalOpen}
        footer={null}
        closable={false}
      >
        <div className="alert-content">
          {title && title !== '' && (
            <h3>{title}</h3>
          )}

          {content && content !== '' && (
            <h4>{content}</h4>
          )}
          <Button onClick={handleCancel}>OK</Button>
        </div>
      </Modal>
    </Fragment>
  );
}

export { Alert }