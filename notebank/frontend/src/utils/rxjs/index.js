import React from 'react';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export const DebouncedFunc = (funcName, time, evtTransform) => Component => props => {
  const subject = new Subject();
  subject.pipe(debounceTime(time)).subscribe(props[funcName]);
  const newProps = {
    ...props,
    [funcName]: evt => subject.next(evtTransform(evt)),
  };
  return <Component {...newProps}/>
};