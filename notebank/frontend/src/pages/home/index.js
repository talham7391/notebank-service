import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const HomePage = _ => (
  <div>
    <Title>Home Page</Title>
    <Paragraph><a href="/notes/create">Upload Note</a></Paragraph>
  </div>
);

ReactDOM.render(<HomePage/>, document.getElementById("root"));