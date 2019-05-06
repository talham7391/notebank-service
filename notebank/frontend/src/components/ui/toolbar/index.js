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

  doLogout = _ => {
    deleteToken();
    window.location.href = window.location.href;
  };

  render() {
    return (
      <S.Toolbar>
        <S.Logo onClick={this.gotoHomePage}>
          <img src="/static/assets/icons/logo.svg"/>
          <Text strong={true} style={{fontSize: 24}}>Notebank</Text>
        </S.Logo>
        { this.props.showLogin !== false &&
          <S.LoginButtons>
            { doesTokenExist() ?
              <Button onClick={this.doLogout} icon="logout">Logout</Button>
              :
              <Fragment>
                <Button onClick={this.gotoCreateAccountPage}>Create Account</Button>
                <Text>or</Text>
                <Button icon="login" onClick={this.gotoLoginPage} type="primary">Login</Button>
              </Fragment>
            }
          </S.LoginButtons>
        }
      </S.Toolbar>
    );
  }
}

export default Toolbar;