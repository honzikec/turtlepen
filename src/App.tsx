/* Copyright 2018 Jan Kaiser */

import React, { Component } from 'react';
import './App.scss';

import { ChartToggle } from './components/ChartToggle';
import { Chart } from './components/Chart';
import { Editor } from './components/Editor';
import { Header } from './components/Header';

import { EditorState } from './models/EditorState.model';
import { AppState } from './models/AppState.model';

class App extends Component<{}, AppState> {

  // initial state before we get some from the Editor component
  public state: AppState = { value: '', error: undefined, triples: [], showChart: false };

  constructor(props: any) {
    super(props);
    // bind "this" (stupid I have to do this :))
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleChartToggle = this.handleChartToggle.bind(this);
  }

  public handleEditorChange(editorState: EditorState): void {
    this.setState(editorState);
  }

  public handleChartToggle(): void {
    this.setState({ showChart: !this.state.showChart });
  }

  public render(): JSX.Element {
    let chartComponent: JSX.Element = <React.Fragment />;
    if (this.state) {
      const chartConfig = { triples: this.state.triples, error: this.state.error };
      chartComponent = this.state.showChart ? <Chart config={chartConfig} /> : <React.Fragment />;
    }
    return (
      <React.Fragment>
        <Header></Header>
        <Editor onEditorChanged={this.handleEditorChange} smaller={this.state.showChart} />
        <ChartToggle open={this.state.showChart} onChartToggled={this.handleChartToggle} />
        {chartComponent}
      </React.Fragment >
    );
  }
}

export default App;
