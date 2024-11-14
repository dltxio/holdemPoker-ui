import React from "react"
import { Outlet } from "react-router"
import { Layout } from 'antd';
import './style.css';

const {Header, Footer, Content} = Layout;

export type UnAuthenticatedLayoutProps = {
  children?: React.ReactNode
}
export const UnAuthenticatedLayout = (props: UnAuthenticatedLayoutProps) => (
  <Layout className="un-authtenticated-layout">
    <Header className="header">
      <div className="logo" />
      {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} /> */}
    </Header>
    <Content>
      <Outlet/>
    </Content>
    <Footer>
      Footer
    </Footer>
  </Layout>
)