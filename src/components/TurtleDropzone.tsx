/* Copyright 2018 Jan Kaiser */

import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

export class TurtleDropzone extends React.Component {
  public onDrop = (acceptedFiles: any, rejectedFiles: any) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const result = reader.result;
        console.log(result);
      });
      reader.readAsText(file);

    }
  }

  public render(): JSX.Element {
    return (

      <Dropzone onDrop={this.onDrop} accept='text/*,'>
        {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
          return (
            <div
              {...getRootProps()}
              className={isDragAccept ? 'dropzone dropzone--isActive' : 'dropzone'}>
              <input {...getInputProps()} />
              {
                isDragActive && isDragAccept ?
                  <p>Drop the file here...</p> :
                  (isDragActive ? <p>Only valid text files are supported...</p>
                    : <p>Try dropping some files here, or click to select files to upload.</p>)
              }
            </div>
          );
        }}
      </Dropzone >
    );
  }
}
