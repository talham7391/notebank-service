import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from 'components/ui/page';
import { PageContent } from 'components/ui/page/styles';
import { Breadcrumb, Icon } from 'antd';
import { HashRouter, Route } from 'react-router-dom';
import BrowseCourses from './browse_courses';
import BrowseSchools from './browse_schools';
import DisplayNotes from './display_notes';

class BrowseNotesPage extends Component {
  render() {
    return (
      <Page>
        <PageContent>
          <HashRouter>
            <Route exact path="/" component={BrowseSchools}/>
            <Route exact path="/school/:schoolid/" component={BrowseCourses}/>
            <Route exact path="/school/:schoolid/course/:courseid/" component={DisplayNotes}/>
          </HashRouter>
        </PageContent>
      </Page>
    );
  }
}

ReactDOM.render(<BrowseNotesPage/>, document.getElementById("root"));