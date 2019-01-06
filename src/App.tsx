import React, { Component } from 'react';
import './App.scss';

import { Chart } from './components/Chart';
import { Editor } from './components/Editor';
import { Header } from './components/Header';

import { EditorState } from './models/EditorState.model';

class App extends Component<{}, EditorState> {
  // initial state before we get some from the Editor component
  public state: EditorState = { value: '', error: undefined, triples: [] };

  constructor(props: any) {
    super(props);
    // bind "this" (stupid I have to do this :))
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  public handleEditorChange(editorState: EditorState): void {
    this.setState(editorState);
  }

  render() {
    let chart: any = '';
    if (this.state) {
      chart = this.state.error && this.state.error !== null ? '' : <Chart triples={this.state.triples} />;
    }
    return (
      <React.Fragment>
        <Header></Header>
        <Editor onEditorChanged={this.handleEditorChange} />
        {chart}
      </React.Fragment>
    );
  }
}

export default App;
