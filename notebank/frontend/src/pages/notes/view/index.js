import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as S from './styles';
import Page from 'components/ui/page';
import { PageContent } from 'components/ui/page/styles';
import { HashRouter, Route } from 'react-router-dom';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as notesApi from 'api/notes';
import { PDF } from 'utils/document/pdf';
import { getLogisticsFromNote } from 'utils/notes';
import { Typography, Icon, Divider } from 'antd';

const { Title, Paragraph } = Typography;

@observer class ViewNoteComponent extends Component {
  @observable note = null;
  @observable data = {
    school: null,
    course: null,
  };
  @observable pageUrls = [];

  reset = _ => {
    this.note = null;
    this.pageUrls = [];
  };

  @action retrieveNote = async _ => {
    this.note = await notesApi.getNote(this.props.match.params.noteid);
  };

  @action retrieveNoteData = async _ => {
    this.data = await getLogisticsFromNote(this.note);
  };

  @action retrieveSheets = async _ => {
    const sheets = await notesApi.getSheets(this.note.id);
    for (let i in sheets) {
      const res = await notesApi.downloadSheet(sheets[i].url);
      if (sheets[i].file_type === 'application/pdf') {
        const pdfFile = new File([res.data], sheets[i].file_name, {type: sheets[i].file_type});
        const pdf = new PDF();
        await pdf.load(URL.createObjectURL(pdfFile));
        for (let j = 0; j < pdf.getPageCount(); j++) {
          const url = await pdf.createDataUrlForPage(j + 1);
          this.pageUrls.push(url);
        }
      } else {
        const url = URL.createObjectURL(res.data);
        this.pageUrls.push(url);
      }
    }
  };

  @action load = async _ => {
    this.reset();
    await this.retrieveNote();
    await this.retrieveNoteData();
    await this.retrieveSheets();
  };

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.noteid !== this.props.match.params.noteid) {
      this.load();
    }
  }

  render() {
    return (
      <Page>
        <PageContent>
          <S.InfoContainer>
            <Title>{this.note?.title}</Title>
            <Paragraph style={{fontSize: '18px'}}>{this.data?.course?.course_code || ''} - {this.data?.course?.name || ''}</Paragraph>
          </S.InfoContainer>
          <Divider/>
          <S.PagesContainer>
            {this.pageUrls.map((url, idx) => (
              <img src={url} key={idx}/>
            ))}
          </S.PagesContainer>
        </PageContent>
      </Page>
    );
  }
}

class ViewNotePage extends Component {
  render() {
    return (
      <HashRouter>
        <Route exact path="/:noteid/" component={ViewNoteComponent}/>
      </HashRouter>
    );
  }
}

ReactDOM.render(<ViewNotePage/>, document.getElementById("root"));