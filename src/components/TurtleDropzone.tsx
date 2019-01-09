/* Copyright 2018 Jan Kaiser */

import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

export class TurtleDropzone extends React.Component {
  public onDrop = (acceptedFiles: any, rejectedFiles: any) => {
    console.log('accepted', acceptedFiles);
    console.error(rejectedFiles);
  }

  public render(): JSX.Element {
    return (
      <Dropzone onDrop={this.onDrop} accept='text/turtle'>
        {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
          return (
            <div
              {...getRootProps()}
              className={isDragAccept ? 'dropzone dropzone--isActive' : 'dropzone'}>
              <input {...getInputProps()} />
              {
                isDragAccept ?
                  <p>Drop files here...</p> :
                  <p>Try dropping some files here, or click to select files to upload.</p>
              }
            </div>
          );
        }}
      </Dropzone >
    );
  }
}
