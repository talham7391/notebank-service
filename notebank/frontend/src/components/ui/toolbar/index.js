import React, { Component, Fragment } from 'react';
import * as S from './styles';
import { Typography, Button } from 'antd';
import { doesTokenExist, deleteToken } from 'api';

const { Text } = Typography;

class Toolbar extends Component {

  gotoHomePage = _ => {
    window.location.href = "/";
  };

  gotoLoginPage = _ => {
    window.location.href = "/login/";
  };

  gotoCreateAccountPage = _ => {
    window.location.href = "/create-account/";
  };

  gotoMyAccount = _ => {
    window.location.href = "/account/";
  };

  doLogout = _ => {
    deleteToken();
    window.location.href = "/login/";
  };

  render() {
    return (
      <S.Toolbar>
        <S.Logo onClick={this.gotoHomePage}>
          <img src="/static/assets/icons/logo.svg"/>
          <Text strong={true} style={{fontSize: 24}}>Notebank</Text>
        </S.Logo>
        { this.props.showLogin !== false &&
          ( doesTokenExist() ?
            <Fragment>
              { this.props.showLogout ?
                <Button onClick={this.doLogout} icon="logout">Logout</Button>
                :
                <Button onClick={this.gotoMyAccount} icon="user" type="primary">My Account</Button>
              }
            </Fragment>
            :
            <S.LoginButtons>
              <Button onClick={this.gotoCreateAccountPage}>Create Account</Button>
              <Text>or</Text>
              <Button icon="login" onClick={this.gotoLoginPage} type="primary">Login</Button>
            </S.LoginButtons>
          )
        }
      </S.Toolbar>
    );
  }
}

export default Toolbar;