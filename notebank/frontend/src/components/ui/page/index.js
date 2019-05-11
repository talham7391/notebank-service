import React, { Component, Fragment } from 'react';
import * as S from './styles';
import Toolbar from 'components/ui/toolbar';
import Footer from 'components/ui/footer';

class Page extends Component {
  render() {
    return (
      <Fragment>
        <S.Page>
          <Toolbar showLogin={this.props.showLogin} showLogout={this.props.showLogout}/>
          {this.props.children}
        </S.Page>
        <Footer />
      </Fragment>
    );
  }
}

export default Page;