import React, { Component, Fragment } from 'react';
import * as S from './styles';
import { Typography, Button } from 'antd';
import { doesTokenExist, deleteToken } from 'api';
import * as urls from 'constants/page/urls';

const { Text } = Typography;

class Toolbar extends Component {

  gotoHomePage = _ => {
    urls.goto(urls.HOME);
  };

  doLogout = _ => {
    deleteToken();
    urls.goto(urls.LOGIN);
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
                <Button href={urls.ACCOUNT} icon="user" type="primary">My Account</Button>
              }
            </Fragment>
            :
            <S.LoginButtons>
              <Button href={urls.CREATE_ACCOUNT}>Create Account</Button>
              <Text>or</Text>
              <Button icon="login" href={urls.LOGIN} type="primary">Login</Button>
            </S.LoginButtons>
          )
        }
      </S.Toolbar>
    );
  }
}

export default Toolbar;