import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link }  from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

const { Header, Content, Footer } = Layout;

class  CustomLayout extends React.Component {
    render(){
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
                            this.props.isAuthenticated ?
                            <Menu.Item key="1" onClick={this.props.logout}>Logout</Menu.Item>
                            :
                            <Menu.Item key="1">
                                <Link to="/login">Login</Link>
                            </Menu.Item>
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
                        {this.props.children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
                </Footer>
            </Layout>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default  connect(null, mapDispatchToProps)( CustomLayout );
