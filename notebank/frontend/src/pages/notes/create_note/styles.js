import styled from 'styled-components';

export const CreateNote = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Steps = styled.div`
  width: 100%;
  max-width: 600px;
  margin: auto;
`;

export const StepContainer = styled.div`
`;

export const FormContainer = styled.div`
  display: flex;
  max-width: 350px;
  width: 100%;
  margin: auto;

  > * {
    flex-grow: 1;
  }
`;