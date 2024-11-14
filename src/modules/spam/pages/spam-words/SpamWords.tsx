import { Fragment, useState, useEffect } from 'react';
import { Tag, Input } from 'antd';
import clsx from 'clsx';
import { remove } from 'lodash';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';

// Constants
import { SAMPLE_TAGS } from '@/constants';

// Helper
import { getRandomNumber, getUniqueKey } from '@/helpers/common';

import './SpamWords.scss';
import { useAppDispatch } from '@/store/hooks';
import { getSpamWords, saveSpamWords } from '../../store/action';

const Page = () => {
  const [data, setData] = useState<any>({});
  const [tags, setTags] = useState<any[]>([]);
  const [onFocus, setOnFocus] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const d = useAppDispatch();

  const load = async () => {
    const { payload } = await d(getSpamWords())
    if (payload) {
      setData(payload);
      setTags(payload.blockedWords.map((word: string) => ({
        id: word,
        label: word
      })));
    }
  }

  const save = async (tags: any[]) => {
    const {payload} = await d(saveSpamWords({
      blockedWords: tags.map(it => it.label),
      blockedWordsList: {
        _id: data._id,
        blockedWords: tags.map(item => ({ text: item.label }))
      }
    }))
  }

  const handleOnEnter = (e: any) => {
    if (inputValue && inputValue !== '') {
      const value = { id: inputValue, label: inputValue };
      tags.push(value);
      setTags([...tags]);
      setInputValue('');
      save(tags);
    }
  }

  const handleOnChange = (e: any) => {
    setInputValue(e.target.value);
  }

  const handleOnClose = (item: any) => {
    remove(tags, { id: item.id });
    setTags([...tags]);
  }

  useEffect(() => {
    // setTags(SAMPLE_TAGS);
    load();
  }, []);

  return (
    <Fragment>
      <div className="spam-words-content">
        <Breadcrumb />

        <div className="row">
          <div className="col-md-12">
            <div className="spam-words-content__wrapper">
              <h3>Spam Words</h3>

              <div className={clsx('spam-words-content__tags', { focus: onFocus })}>
                <ul>
                  {tags && tags.length ? tags.map((item, index) => (
                    <li key={getUniqueKey()}>
                      <Tag
                        className="default"
                        closable={true}
                        onClose={() => handleOnClose(item)}
                      >
                        {item.label}
                      </Tag>
                    </li>
                  )) : null}
                </ul>

                <Input
                  placeholder="Add a word"
                  onPressEnter={handleOnEnter}
                  onFocus={() => setOnFocus(true)}
                  onBlur={() => setOnFocus(false)}
                  value={inputValue}
                  onChange={handleOnChange}
                />
              </div>

              <div className="spam-words-content__note">
                <p>Note: Please type and hit Enter to save Spam Words.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
};

export default Page;