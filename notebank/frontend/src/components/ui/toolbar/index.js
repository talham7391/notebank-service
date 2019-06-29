import React, { Component, Fragment } from 'react';
import * as S from './styles';
import { Typography, Button, Icon, Menu, Drawer } from 'antd';
import { doesTokenExist, deleteToken } from 'api';
import * as urls from 'constants/page/urls';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

const { Text } = Typography;

@observer class Toolbar extends Component {
  @observable showDrawer = false;

  gotoHomePage = _ => {
    urls.goto(urls.HOME);
  };

  doLogout = _ => {
    deleteToken();
    urls.goto(urls.LOGIN);
  };

  @action onDrawerOpen = _ => {
    this.showDrawer = true;
  };

  @action onDrawerClose = _ => {
    this.showDrawer = false;
  };

  render() {
    return (
      <S.Toolbar>
        <S.Logo onClick={this.gotoHomePage}>
          <img src="/static/assets/icons/logo.svg"/>
          <Text strong={true} style={{fontSize: 24}}>Notebank</Text>
        </S.Logo>
        <S.Actions>
          <Text><a href={urls.HOME}>Home</a></Text>
          <Text><a href={urls.BROWSE_NOTES}>Browse</a></Text>
          { this.props.showLogin !== false &&
            ( doesTokenExist() ?
              <Fragment>
                { this.props.showLogout ?
                  <Button onClick={this.doLogout} icon="logout">Logout</Button>
                  :
                  <Button href={urls.ACCOUNT} icon="user" type="primary">My Account</Button>
                }
              </Fragment>
              :
              <S.LoginButtons>
                {/* <Button href={urls.CREATE_ACCOUNT}>Create Account</Button>
                <Text>or</Text> */}
                <Button icon="login" href={urls.LOGIN} type="primary">Login</Button>
              </S.LoginButtons>
            )
          }
        </S.Actions>
        <S.Menu>
          <Button icon="menu" type="primary" onClick={this.onDrawerOpen}/>
          <Drawer
            placement="right"
            bodyStyle={{padding: '0px'}}
            visible={this.showDrawer}
            onClose={this.onDrawerClose}
            closable={false}>
            <Menu
              selectedKeys={[]}>
              <Menu.Item onClick={_ => urls.goto(urls.HOME)}>Home</Menu.Item>
              <Menu.Item onClick={_ => urls.goto(urls.BROWSE_NOTES)}>Browse</Menu.Item>
              { this.props.showLogin !== false && doesTokenExist() && this.props.showLogout &&
                <Menu.Item onClick={this.doLogout}>
                  <Icon type="logout"/>
                  <span>Logout</span>
                </Menu.Item>
              }
              { this.props.showLogin !== false && doesTokenExist() && !this.props.showLogout &&
                <Menu.Item onClick={_ => urls.goto(urls.ACCOUNT)}>
                  <Icon type="user"/>
                  <span>My Account</span>
                </Menu.Item>
              }
              {/* { this.props.showLogin !== false && !doesTokenExist() &&
                <Menu.Item onClick={_ => urls.goto(urls.CREATE_ACCOUNT)}>
                  <span>Create Account</span>
                </Menu.Item>
              } */}
              { this.props.showLogin !== false && !doesTokenExist() &&
                <Menu.Item onClick={_ => urls.goto(urls.LOGIN)}>
                  <Icon type="login"/>
                  <span>Login</span>
                </Menu.Item>
              }
            </Menu>
          </Drawer>
        </S.Menu>
      </S.Toolbar>
    );
  }
}

export default Toolbar;