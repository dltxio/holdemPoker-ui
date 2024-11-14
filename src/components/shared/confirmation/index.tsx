import React, { useContext } from 'react';
import { DefaultLoader } from './DefaultLoader';

export type ConfirmationContextState = {
  isShow: boolean,
  message?: string;
  showConfirm: (options: ConfirmationOptions) => Promise<{
    data: any
  }>;
  ok: (data?: any) => void;
  cancel: () => void;
  options: ConfirmationOptions
}

const initialState: ConfirmationContextState = {
  isShow: false,
  showConfirm: async (options: ConfirmationOptions) => ({data: null}),
  ok: () => {},
  cancel: () => {},
  options: {
    message: 'Are you sure?'
  }
}

const Context = React.createContext<ConfirmationContextState>(initialState);
Context.displayName = 'ConfirmationContext';

export const useConfirmationContext = () => useContext(Context);
export const ConfirmationContextProvider = Context.Provider;
export const ConfirmationContextConsumer = Context.Consumer;

export type ConfirmationContextWrapperProps = {
  loader?: React.FC<ConfirmationContextState>;
  children?: any,
}

export type ConfirmationOptions = {
  type?: 'default' | 'info' | 'error' | 'warning',
  message: string,
  title?: string,
  okText?: string,
  cancelText?: string,
  showReason?: boolean
}

export class ConfirmationContextWrapper extends React.Component<ConfirmationContextWrapperProps, ConfirmationContextState> {
  state = initialState;
  static defaultProps = {
    loader: DefaultLoader
  }
  waiter?: Promise<any> = undefined;
  waiterResovler: any = undefined;

  showConfirm = (options: ConfirmationOptions) => {
    this.setState({
      isShow: true,
      message: options.message,
      options
    });
    this.waiter = new Promise((resovle, reject) => {
      this.waiterResovler = {
        resovle, reject
      };
    });
    return this.waiter;
  }
  cancel = () => {
    this.setState({
      isShow: false,
      message: ''
    });
    this.waiterResovler.reject();
  }
  ok = (data?: any) => {
    this.setState({
      isShow: false,
      message: ''
    });
    this.waiterResovler.resovle({
      data
    });
  }
  render() {
    return (
      <ConfirmationContextProvider value={{
        ...this.state,
        showConfirm: this.showConfirm,
        ok: this.ok,
        cancel: this.cancel
      }}>
        {this.props.children}
      </ConfirmationContextProvider>
    )
  }
}