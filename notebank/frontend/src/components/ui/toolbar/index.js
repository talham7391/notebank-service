import React, { Component } from 'react';
import * as S from './styles';
import { Typography, Button } from 'antd';

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

  render() {
    return (
      <S.Toolbar>
        <S.Logo onClick={this.gotoHomePage}>
          <img src="/static/assets/icons/logo.svg"/>
          <Text strong={true} style={{fontSize: 24}}>Notebank</Text>
        </S.Logo>
        { this.props.showLogin !== false &&
          <S.LoginButtons>
            <Button onClick={this.gotoCreateAccountPage}>Create Account</Button>
            <Text>or</Text>
            <Button icon="login" onClick={this.gotoLoginPage} type="primary">Login</Button>
          </S.LoginButtons>
        }
      </S.Toolbar>
    );
  }
}

export default Toolbar;