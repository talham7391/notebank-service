import React, { Component } from 'react';
import * as S from './styles';
import ReactDOM from 'react-dom';
import UploadStep from './upload_step';
import MoneyStep from './money_step';
import SubmitStep from './submit_step';
import CreateStep from './create_step';
import state from './state';
import { Steps, Icon, Button } from 'antd';
import { observer } from 'mobx-react';
import { observable, action, toJS } from 'mobx';
import { createNote } from 'api/notes';
import Page from 'components/ui/page';
import { PageContent } from 'components/ui/page/styles';

const Step = Steps.Step;

@observer class CreateNotePage extends Component {
  @observable currentStep = 0;
  @observable previousStep = undefined;

  @action incrementStep = _ => {
    this.previousStep = this.currentStep;
    this.currentStep++;
  };
  
  @action decrementStep = _ => {
    this.previousStep = this.currentStep;
    this.currentStep--;
  };

  @action onNextStep = _ => {
    window.scrollTo(0, 0);
    this.currentStep++;
  };
  
  @action onPreviousStep = _ => {
    window.scrollTo(0, 0);
    this.currentStep--;
  };

  render () {
    return (
      <Page>
        <PageContent>
          <S.CreateNote>
            { this.currentStep === 0 && <UploadStep state={state} onNextStep={this.onNextStep}/> }
            { this.currentStep === 1 && <CreateStep state={state}/> }
          </S.CreateNote>
        </PageContent>
      </Page>
    );
  }
}

ReactDOM.render(<CreateNotePage/>, document.getElementById("root"));