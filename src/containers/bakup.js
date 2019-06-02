import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link }  from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const CustomLayout = (props) => {
   return (

            <Layout className="layout">
            <Header>
            <div className="logo" />
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
            >

            {
                props.isAuthenticated ?

                <Menu.Item key="1">Logout</Menu.Item>

                :

                <Menu.Item key="1">Login</Menu.Item>





            }
                
                <Menu.Item key="2">nav 2</Menu.Item>
                
            </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item><Link to='/' >Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/Events' >Events</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/Instantaneous' >Instantaneous</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/Billing' >Billing</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/MonthlyBilling' >MonthlyBilling</Link></Breadcrumb.Item>

            </Breadcrumb>

                    <div style={{ background: '#fff', padding: 24, height: '1000px' }}>
                    {props.children}
                    </div>

            </Content>
            <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
            </Footer>
           </Layout>
         );

}


export default CustomLayout;
 