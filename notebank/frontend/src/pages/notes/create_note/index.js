import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import UploadStep from './upload_step';
import state from './state';

class CreateNotePage extends Component {
  render () {
    return (
      <div>
        <UploadStep state={state}/>
      </div>
    );
  }
}

ReactDOM.render(<CreateNotePage/>, document.getElementById("root"));