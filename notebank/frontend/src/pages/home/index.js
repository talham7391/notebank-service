import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Typography, Button } from 'antd';
import Page from 'components/ui/page';
import * as S from './styles';

const { Title, Paragraph } = Typography;

class HomePage extends Component {
  gotoBrowse = _ => {
    window.location.href = '/browse/';
  };

  render () {
    return (
      <Page>
        <S.Jumbotron>
          <S.Intro>
            <Title>A Note Exchange for Students</Title>
            <Paragraph style={{fontSize: '18px'}}>
              Find assignment solutions, past midterms & exams, course notes, and more...
            </Paragraph>
            <Button onClick={this.gotoBrowse} type="primary" icon="bank">Browse Notes</Button>
          </S.Intro>
          <S.BackgroundImage/>
        </S.Jumbotron>
      </Page>
    )};
}

ReactDOM.render(<HomePage/>, document.getElementById("root"));