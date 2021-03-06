/* Copyright 2019 Jan Kaiser */

import React, { Component } from 'react';
import AceEditor from 'react-ace';
import * as n3 from 'n3';

import { TurtleEditorMode } from './../../utils/TurtleEditorMode';

import { N3Error } from './../../models/N3Error.model';
import { EditorChangeProps } from './../../models/EditorChangeProps.model';
import { EditorState } from './../../models/EditorState.model';

import FileSaver from 'file-saver';

import 'brace/mode/xml';
import 'brace/theme/twilight';
import 'brace/ext/searchbox';

import { TurtleDropzone } from './TurtleDropzone';

export class Editor extends Component<EditorChangeProps, EditorState> {
    public static CURRENT_INPUT_KEY = 'turtlepen_current_input';

    private _aceEditor: React.RefObject<any>;

    constructor(props: any) {
        super(props);
        this._aceEditor = React.createRef();
        this.state = {
            value: localStorage.getItem(Editor.CURRENT_INPUT_KEY) || ''
        };

        // stupid "this" binding
        this.handleChange = this.handleChange.bind(this);
        this.exportAsFile = this.exportAsFile.bind(this);
        this.handleFileImport = this.handleFileImport.bind(this);
        this.saveStateToLocalStorage = this.saveStateToLocalStorage.bind(this);
    }

    /**
     * Triggers Resize on the ACE Editor when the component got updated
     *
     * @param {EditorChangeProps} props
     * @memberof Editor
     */
    public componentDidUpdate(props: EditorChangeProps) {
        this.triggerResize();
    }

    /**
     * Validates the present turtle markup
     *
     * @memberof Editor
     */
    public validate(): void {
        this.setState({ error: undefined });
        this.parse().then((triples: Array<n3.Quad>) => {
            this.setState({ triples });
            this.props.onEditorChanged(this.state);
        });
    }

    /**
     * Called on every change in editor's content
     * Updates state and runs validation
     *
     * @param {string} value
     * @memberof Editor
     */
    public handleChange(value: string): void {
        this.setState({ value });
        this.validate();
    }

    /**
     * Grabs the content of the editor, dumps it into a file and triggers download
     *
     * @memberof Editor
     */
    public exportAsFile(): void {
        const blob = new Blob([this.state.value], { type: 'text/turtle;charset=utf-8' });
        FileSaver.saveAs(blob, 'turtlepen_output.ttl');
    }

    /**
     * Received from the dropzone
     * Updates value with a new one from the imported file
     *
     * @param {string} result
     * @memberof Editor
     */
    public handleFileImport(result: string): void {
        this.handleChange(result);
    }

    public componentDidMount(): void {
        const customMode = new TurtleEditorMode();
        if (this._aceEditor.current) {
            this._aceEditor.current.editor.getSession().setMode(customMode);
            this.validate();
        }
        window.addEventListener('beforeunload', this.saveStateToLocalStorage);
    }

    public componentWillUnmount(): void {
        this.saveStateToLocalStorage();
        // remove the event handler for normal unmounting
        window.removeEventListener('beforeunload', this.saveStateToLocalStorage);
    }

    public render(): JSX.Element {
        const errorMessage = this.state.error && this.state.error.message ?
            <div className='editor__error'><span className='ico-error'></span> {this.state.error.message}</div>
            : <React.Fragment />;

        const editorClassName = 'editor'
            + (this.props.smaller ? ' editor--with-chart' : '')
            + (this.state.error ? ' editor--has-error' : '');

        return (
            <div className={editorClassName}>
                <div className='editor__buttons'>
                    <TurtleDropzone onFileImport={this.handleFileImport} />
                    <button onClick={this.exportAsFile} className='button'>
                        <span className='ico-download'></span> Export as file...
                    </button>
                </div>
                <AceEditor
                    ref={this._aceEditor}
                    mode='text'
                    theme='twilight'
                    height='100%'
                    width='100%'
                    className='editor__window'
                    onChange={this.handleChange}
                    name='turtle-editor'
                    editorProps={{ $blockScrolling: true }}
                    value={this.state.value}
                />
                {errorMessage}
            </div>
        );
    }

    private saveStateToLocalStorage(): void {
        localStorage.setItem(Editor.CURRENT_INPUT_KEY, this.state.value);
    }

    private parse(): Promise<Array<n3.Quad>> {
        return new Promise((resolve, reject) => {
            const parser = n3.Parser({ format: 'text/turtle' });
            const triples: Array<n3.Quad> = [];
            const editor = this._aceEditor.current.editor.getSession();
            editor.clearAnnotations();
            parser.parse(this.state.value, (error: N3Error, triple: n3.Quad, prefixes: n3.Prefixes) => {
                if (error) {
                    this.setState({ error });
                    editor.setAnnotations([{
                        row: error.context ? error.context.line - 1 : 1,
                        text: error.message,
                        type: 'error'
                    }]);
                } else if (triple) {
                    triples.push(triple);
                }
                resolve(triples);
            });
        });
    }

    private triggerResize(): void {
        this._aceEditor.current.editor.resize();
    }
}
