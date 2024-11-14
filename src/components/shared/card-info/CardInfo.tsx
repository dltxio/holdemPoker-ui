import React, { Fragment, useRef, useState } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faUpRightAndDownLeftFromCenter,
  faArrowsRotate,
  faDownload
} from '@fortawesome/free-solid-svg-icons';

import './CardInfo.scss';
import DisplayNumber from '../DisplayNumber';
import { useBusyContext } from '../busy';
import { saveAsPdf } from '@/helpers/pdf';
import { isNumber } from 'lodash';
interface IItem {
  label: string,
  value: any,
  customRender?: React.FC<{
    value: any,
  }>
}
type Props = {
  type?: 'primary' | 'danger' | 'info' | 'secondary' | 'warning';
  icon: string;
  title: string;
  data: Array<IItem>,
  onRefresh?: () => void,
}

const CardInfo: React.FC<Props> = ({ type, icon, title, data, onRefresh }) => {
  const [showing, setShowing] = useState<boolean>(true);
  const [isFull, setIsFull] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const bs = useBusyContext();

  const handleShowing = () => {
    setShowing(!showing);
  }

  const handleIsFull = () => {
    setIsFull(!isFull);
  }

  const handleExport = async () => {
    try {
      if (ref.current) {
        bs.showBusy();
        await saveAsPdf(ref.current, title.replace(/ /gi, '-'))
      }
    } finally {
      bs.hideBusy();
    }
  }
  const renderContent = (item: IItem) => {
    const CustomRender = item.customRender;
    if (CustomRender) {
      return <CustomRender value={item.value} />
    } else {
      if(item.value === 0){
        return 0;
      }
      return (
        <Fragment> {(item.value && isNumber(item.value)) ? <DisplayNumber value={item.value} /> : (item.value || 'N/A')}</Fragment>
      )
    }

  }

  return (
    <Fragment>
      <div
        ref={ref}
        className={clsx(
          'card-info-content',
          { full: isFull },
          { primary: type === undefined || !type },
          type,
        )}
      >
        <div className="card-info-content__header">
          <div className="card-info-content__header__left">
            <i className={clsx('bi', icon)}></i>
            <span>{title}</span>
          </div>

          <div className="card-info-content__header__right">
            {!isFull && (<FontAwesomeIcon className="expand" onClick={handleShowing} icon={showing ? faAngleDown : faAngleUp} />)}
            <FontAwesomeIcon onClick={handleIsFull} icon={faUpRightAndDownLeftFromCenter} />
            <FontAwesomeIcon onClick={onRefresh} icon={faArrowsRotate} />
            <FontAwesomeIcon onClick={handleExport} icon={faDownload} />
          </div>
        </div>

        <div className={clsx('card-info-content__body', { hidden: !showing })}>
          <div className="row">
            {data.map((item, idx) => (
              <div key={`item-${idx}`} className="col-md-6 col-sm-12">
                <div className="card-info-content__body__item">
                  <div className="card-info-content__body__item__label">
                    <label>{item.label}:</label>
                  </div>

                  <div className="card-info-content__body__item__data">
                    <p>{renderContent(item)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-info-content__footer"></div>
      </div>
    </Fragment>
  );
}

export { CardInfo }