import { Button, MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Outlet } from "react-router";
import { Link } from 'react-router-dom';
import { NavIcons, NavItems } from './nav';
import {logo} from '@/assets/images';
import { LogoutOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const buildNavItems = (items: any[], parent: any): any[] => {
  return items.map(
    (item: any) => {
      const icon = NavIcons[item.iconClass];
      return {
        key: parent ? `nav-item-${parent.code}-${item.code}` : `nav-item-${item.code}`,
        icon: icon ? React.createElement(icon) : null,
        label: `${item.name}`,
        path: item.route || '',
        children: item.children && item.children.length && buildNavItems(item.children, item),
      };
    },
  )
} 

const navItems: MenuProps['items'] = buildNavItems(NavItems, null);

const getPath = (path: string) => {
  const paths = path.split('/');
  return paths.filter(x => x !== '').join('/')
}

const buildFlatItems = (items: any[], parent: any, result: any[] = []) => {
  items.forEach(({...item}: any) => {
    const itemPath = getPath(item.path);
    const newItem = {
      ...item,
      parent,
      path: parent && parent.path ? `${parent.path}/${itemPath}` : itemPath,
      children: 0
    };
    result.push(newItem)
    if (item.children) {
      buildFlatItems(item.children, newItem, result)
    }
  });
  return result;
}
const flatItems: any = buildFlatItems(navItems, null, []);

const getCurrentNavInfo = (pathname: string) => {
  const navItem = flatItems.find((x: any) => x.path === getPath(pathname));
  let item = navItem;
  const result: any[] = [];
  while(item) {
    result.push(item);
    item = item.parent;
  }
  return {
    openKeys: result.map(x => x.key).reverse(),
    selectedKeys: result.map(x => x.key).reverse(),
    breadcrumbItems: result.reverse()
  };
};

export const AuthenticatedLayout: React.FC = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  useEffect(() => {
    const currentNav = getCurrentNavInfo(location.pathname);
    if (currentNav) {
      setOpenKeys(currentNav.openKeys);
      setSelectedKeys(currentNav.selectedKeys);
      setBreadcrumbItems(currentNav.breadcrumbItems);
    }
  }, [location.pathname]);

  const open = (item: any) => {
    setOpenKeys([item.key])
  }

  return (
    <Layout>
      <Header
        className="header"
        style={{
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div className="logo">
          <img src={logo} />
        </div>
        <div>
          <Button
            onClick={() => nav('/')}
          >
            <LogoutOutlined/> Logout
          </Button>
        </div>
      </Header>
      <Layout hasSider>
        <Sider
          width={300}
          className="site-layout-background"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            background: 'white',
            top: 0,
            bottom: 0,
            overflowX: 'hidden',
            paddingTop: 64
          }}
        >
          <Menu
            mode="inline"
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            style={{ height: '100%', borderRight: 0 }}
          >
            {navItems.map((item: any) => (
              item.children && item.children.length ? (
                  <Menu.SubMenu
                    key={item.key}
                    {...item}
                    title={item.label}
                    onTitleClick={() => open(item)}
                  >
                    {item.children.map((subitem: any) => (
                      <Menu.Item
                        key={subitem.key}
                        {...subitem}
                      >
                        <Link to={`/${subitem.path}`} title={subitem.label}>{subitem.label}</Link>
                      </Menu.Item>
                    ))}
                  </Menu.SubMenu>
                ) 
                :
                <Menu.Item
                  key={item.key}
                  {...item}
                  onClick={() => open(item)}
                >
                  <Link to={`/${item.path}`} title={item.label}>{item.label}</Link>
                </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0', marginLeft: 300, }}>
            <Breadcrumb.Item>
              <Link to={'/dashboard'}>Home</Link>
            </Breadcrumb.Item>
            {breadcrumbItems.map(item => (
              <Breadcrumb.Item
                key={item.key}
              >
                {item.path ? <Link to={'/' + item.path}>{item.label}</Link> : item.label}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              marginLeft: 300,
              minHeight: 280,
              background: 'white'
            }}
          >
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
