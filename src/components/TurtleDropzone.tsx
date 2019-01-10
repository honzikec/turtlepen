/* Copyright 2018 Jan Kaiser */

import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { FileImportProps } from '../models/FileImportProps.model';

export class TurtleDropzone extends React.Component<FileImportProps, {}> {
  public onDrop = (acceptedFiles: any, rejectedFiles: any) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const result: string = reader.result ? reader.result.toString() : '';
        this.props.onFileImport(result);
      });
      reader.readAsText(file);

    }
  }

  public render(): JSX.Element {
    return (

      <Dropzone onDrop={this.onDrop} accept='text/*,'>
        {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
          let text = 'Select or drop file to import turtle...';
          let dropzoneClass = 'dropzone';
          if (isDragActive) {
            dropzoneClass = isDragAccept ? 'dropzone--active' : 'dropzone--error';
            text = isDragAccept ? 'Drop the files here...' : 'Only valid text files are supported...';
          }
          return (
            <div
              {...getRootProps()}
              className={dropzoneClass}>
              <input {...getInputProps()} />
              <React.Fragment><span className='ico-upload'></span> {text}</React.Fragment>
            </div>
          );
        }}
      </Dropzone >
    );
  }
}
