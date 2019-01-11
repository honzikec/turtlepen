/* Copyright 2019 Jan Kaiser */

import React, { Component } from 'react';

import { AppState } from './../models/AppState.model';
import { EditorState } from '../models/EditorState.model';

import { Editor } from './main/Editor';
import { ChartToggle } from './main/ChartToggle';
import { Chart } from './main/Chart';

export class Main extends Component<{}, AppState> {

  // initial state before we get some from the Editor component
  public state: AppState = { value: '', error: undefined, triples: [], showChart: false };

  constructor(props: any) {
    super(props);
    // bind "this" (stupid I have to do this :))
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleChartToggle = this.handleChartToggle.bind(this);
  }

  /**
   * Sets new editor state
   * Called on every editor content change
   *
   * @param {EditorState} editorState
   * @memberof Main
   */
  public handleEditorChange(editorState: EditorState): void {
    this.setState(editorState);
  }

  /**
   * Sets the chart visibility state (show / hide)
   * Called when the Chart Toggle has been clicked
   *
   * @memberof Main
   */
  public handleChartToggle(): void {
    this.setState({ showChart: !this.state.showChart });
  }

  public render(): JSX.Element {
    const hasError = this.state.error ? true : false;
    let chartComponent: JSX.Element = <React.Fragment />;
    if (this.state) {
      const chartConfig = { triples: this.state.triples, error: this.state.error };
      chartComponent = this.state.showChart ? <Chart config={chartConfig} /> : <React.Fragment />;
    }
    return (
      <React.Fragment>
        <Editor onEditorChanged={this.handleEditorChange} smaller={this.state.showChart} />
        <ChartToggle open={this.state.showChart} hasError={hasError} onChartToggled={this.handleChartToggle} />
        {chartComponent}
      </React.Fragment>
    );
  }
}
