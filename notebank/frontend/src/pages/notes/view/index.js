import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from 'components/ui/page';
import { PageContent } from 'components/ui/page/styles';
import { HashRouter, Route } from 'react-router-dom';

class ViewNoteComponent extends Component {
  render() {
    return (
      <Page>
        <PageContent>
          <div>Viewing note {this.props.match.params.noteid}!</div>
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