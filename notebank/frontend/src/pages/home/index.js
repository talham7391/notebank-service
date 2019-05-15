import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Typography, Button } from 'antd';
import Page from 'components/ui/page';
import * as S from './styles';
import * as urls from 'constants/page/urls';

const { Title, Paragraph } = Typography;

class HomePage extends Component {
  render () {
    return (
      <Page>
        <S.Jumbotron>
          <S.Intro>
            <Title>A Note Exchange for Students</Title>
            <Paragraph style={{fontSize: '18px'}}>
              Find assignment solutions, past midterms & exams, course notes, and more...
            </Paragraph>
            <Button href={urls.BROWSE_NOTES} type="primary" icon="bank">Browse Notes</Button>
          </S.Intro>
          <S.BackgroundImage/>
        </S.Jumbotron>
      </Page>
    )};
}

ReactDOM.render(<HomePage/>, document.getElementById("root"));