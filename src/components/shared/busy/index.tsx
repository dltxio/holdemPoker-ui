import React, { useContext } from 'react';
import { DefaultLoader } from './DefaultLoader';

export type BusyContextState = {
  isShow: boolean,
  message?: string;
  showBusy: () => void;
  hideBusy: () => void;
}

const initialState: BusyContextState = {
  isShow: false,
  showBusy: (message?: string) => {},
  hideBusy: () => {},
}

const Context = React.createContext<BusyContextState>(initialState);
Context.displayName = 'BusyContext';

export const useBusyContext = () => useContext(Context);
export const BusyContextProvider = Context.Provider;
export const BusyContextConsumer = Context.Consumer;

export type BusyContextWrapperProps = {
  loader?: React.FC;
  children?: any
}

export class BusyContextWrapper extends React.Component<BusyContextWrapperProps, BusyContextState> {
  state = initialState;
  static defaultProps = {
    loader: DefaultLoader
  }
  showBusy = (message?: string, options?: any) => {
    this.setState({
      isShow: true,
      message
    });
  }
  hideBusy = () => {
    this.setState({
      isShow: false,
      message: ''
    });
  }
  render() {
    return (
      <BusyContextProvider value={{
        ...this.state,
        showBusy: this.showBusy,
        hideBusy: this.hideBusy
      }}>
        {this.props.children}
      </BusyContextProvider>
    )
  }
}