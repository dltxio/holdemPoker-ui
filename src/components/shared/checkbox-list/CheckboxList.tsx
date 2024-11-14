import React, { Fragment, useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Checkbox } from 'antd';
import { flatMapDeep, filter, map } from 'lodash';

// Helpers
import { getUniqueKey } from '@/helpers/common';

import './CheckboxList.scss';

type Props = {
  data: any;
  checkedModules?: any[];
  viewMode?: boolean;
  onChange: (code: number[]) => void;
}

type ForwardedRef = {
  resetChecked: () => void;
}

type ChildItemProps = {
  item: any;
  parent0: any;
  parent1: any;
  viewMode?: boolean;
  onChange: (item: any, parent0: any, parent1: any) => void;
}

const Child: React.FC<ChildItemProps> = ({ item, parent0, parent1, viewMode, onChange }) => {
  const handleOnChange = () => {
    if (viewMode) return;
    onChange(item, parent0, parent1);
  }

  return (
    <Fragment>
      <Checkbox
        onChange={handleOnChange}
        className="default"
        checked={item.checked}
      ></Checkbox>

      <span className="label">{item.name}</span>
    </Fragment>
  );
}

const CheckboxList = forwardRef<ForwardedRef, Props>(({ data, checkedModules, viewMode, onChange }, forwardedRef) => {
  const [items, setItems] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);

  const updateChildStatus = (items: any[], checked: boolean) => {
    if (items && items.length) {
      for (const item of items) {
        item.checked = checked;

        if (item.subModule && item.subModule.length) {
          item.subModule = updateChildStatus(item.subModule, item.checked);
        }
      }
    }

    return items;
  }

  const handleOnChange = (item: any, parent0: any, parent1: any) => {
    // Level 0
    if (items && items.length) {
      for (const level0 of items) {
        if (level0.code === item.code) {
          level0.checked = !level0.checked;

          if (level0.subModule && level0.subModule.length) {
            level0.subModule = updateChildStatus(level0.subModule, level0.checked);
          }

          // setItems([...items]);
          setItems((prevItems) => {
            const updatedItems = [...prevItems];
            return updatedItems;
          });
          getCodes();
          break;
        }

        // Level 1
        if (level0.subModule && level0.subModule.length) {
          for (const level1 of level0.subModule) {
            if (level1.code === item.code) {
              level1.checked = !level1.checked;

              if (level1.subModule && level1.subModule.length) {
                level1.subModule = updateChildStatus(level1.subModule, level1.checked);
              }

              if (level1.checked) {
                level0.checked = true;
              }

              // setItems([...items]);
              setItems((prevItems) => {
                const updatedItems = [...prevItems];
                return updatedItems;
              });
              getCodes();
              break;
            }

            // Level 2
            if (level1.subModule && level1.subModule.length) {
              for (const level2 of level1.subModule) {
                if (level2.code === item.code) {
                  level2.checked = !level2.checked;

                  if (level2.checked) {
                    level1.checked = true;
                    level0.checked = true;
                  }

                  // setItems([...items]);
                  setItems((prevItems) => {
                    const updatedItems = [...prevItems];
                    return updatedItems;
                  });
                  getCodes();
                  break;
                }
              }
            }
          }
        }
      }
    }
  }

  const getSubModules = (item: any): any => {
    if (!item.subModule || !item.subModule.length) {
      return item;
    }
    return [item, flatMapDeep(item.subModule, getSubModules)];
  }

  const getCodes = () => {
    const formattedItems = flatMapDeep(items, getSubModules);
    const checkedItems = filter(formattedItems, (item) => item.checked);
    const codes = map(checkedItems, 'code');
    setCodes(codes);
  }

  const isChecked = (code: number) => {
    if (checkedModules && checkedModules.length && checkedModules.indexOf(code.toString()) > -1) {
      return true;
    }
    return false;
  }

  const addCheckedProperty = (items: any[]) => {
    const newItems: any[] = [];

    if (items && items.length) {
      for (let item of items) {
        item = { ...item, checked: isChecked(item.code) };
        newItems.push(item);
        item.subModule = addCheckedProperty(item.subModule);
      }
    }

    return newItems;
  }

  const handleResetChecked = (items: any[]) => {
    if (items && items.length) {
      for (const item of items) {
        item.checked = false;

        if (item.subModule && item.subModule.length) {
          item.subModule = handleResetChecked(item.subModule);
        }
      }
    }

    return items;
  }

  useImperativeHandle(forwardedRef, () => ({
    resetChecked() {
      const modules = handleResetChecked(items);
      setItems([...modules]);
      setCodes([]);
    },
  }));

  useEffect(() => {
    if (data && data.length) {
      const items = addCheckedProperty(data);
      setItems(items);
    }
  }, [data]);

  // useEffect(() => {
  //   onChange(codes);
  // }, [codes]);

  const handleCodesChange = useCallback(() => {
    onChange(codes);
  }, [codes]);

  // useEffect(() => {
  //   if (checkedModules && checkedModules.length) {
  //     onChange(checkedModules);
  //   }
  // }, [checkedModules]);

  useEffect(() => {
    handleCodesChange();
  }, [handleCodesChange]);

  return (
    <Fragment>
      <div className="checkbox-list-content">
        {items && items.length ? (
          <ul>
            {items.map((level0: any) => {
              if (level0.status && level0.subModule && level0.subModule.length) {
                return (
                  <li key={getUniqueKey()} className="level0">
                    <Child
                      item={level0}
                      parent0={null}
                      parent1={null}
                      viewMode={viewMode}
                      onChange={handleOnChange}
                    />

                    <ul key={getUniqueKey()}>
                      {level0.subModule.map((level1: any) => {
                        if (level1.status && level1.subModule && level1.subModule.length) {
                          return (
                            <li key={getUniqueKey()} className="level1">
                              <Child
                                item={level1}
                                parent0={level0}
                                parent1={null}
                                viewMode={viewMode}
                                onChange={handleOnChange}
                              />

                              <ul key={getUniqueKey()}>
                                {level1.subModule.map((level2: any) => (
                                  level2.status &&
                                  <li key={getUniqueKey()} className="level2">
                                    <Child
                                      item={level2}
                                      parent0={level0}
                                      parent1={level1}
                                      viewMode={viewMode}
                                      onChange={handleOnChange}
                                    />
                                  </li>
                                ))}
                              </ul>
                            </li>
                          );
                        }

                        return (
                          level1.status &&
                          <li key={getUniqueKey()} className="level1">
                            <Child
                              key={getUniqueKey()}
                              item={level1}
                              parent0={level0}
                              parent1={null}
                              viewMode={viewMode}
                              onChange={handleOnChange}
                            />
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                );
              }

              return (
                level0.status &&
                <li key={getUniqueKey()} className="level0">
                  <Child
                    item={level0}
                    parent0={null}
                    parent1={null}
                    viewMode={viewMode}
                    onChange={handleOnChange}
                  />
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    </Fragment>
  );
});

export { CheckboxList }