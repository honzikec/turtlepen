/* Copyright 2019 Jan Kaiser */

import React, { Component } from 'react';
import logo from './../assets/logo.svg';

export class About extends Component {
  public render(): JSX.Element {
    return (
      <section className='page'>
        <h1>About <img title='TurtlePen' src={logo} className='page__logo' /></h1>
        <p>
          TurtlePen is an academic project written in <a href='https://reactjs.org/'>React.js</a> that allows simple and
          intuitive editing, validation and visualisation of <a href='https://www.w3.org/TR/turtle/' target='_blank'>
            <abbr title='Terse RDF Triple Language'>TURTLE</abbr></a>.
        </p>
        <p>
          It will also work for any other documents
            in the <a href='https://www.w3.org/TeamSubmission/n3/' target='_blank'>N3Notation</a> but the syntax
          highlighting might not be perfect.
        </p>
        <p>
          It also allows importing and exporting files
          containing turtle markup and saves your current progress into local storage of your browser.
        </p>
        <p>
          It was written as a part of an assignement for a Linked Data course
          at the <a href='https://www.vse.cz/english/' target='_blank'>University of Economics in Prague</a>.
        </p>
        <p>
          Apart from React.js, the app also heavily depends
          on <a href='https://github.com/rdfjs/N3.js' target='_blank'>N3.js</a> (used for parsing and
          validation), <a href='https://github.com/securingsincity/react-ace' target='_blank'>react-ace</a> (a
          wrapper for <a href='https://github.com/ajaxorg/ace' target='_blank'>ACE editor</a>)
          and on <a href='https://github.com/d3/d3' target='_blank'>d3</a> data visualisation library.
        </p>
        <p>
          Syntax highlighting rules were heavily inspired
          by <a href='https://github.com/patchspace/sparql-sublime/blob/master/turtle.tmLanguage.JSON' target='_blank'>
            this implementation for Sublime</a> by <a href='https://github.com/ashmoran' target='_blank'>Ash Moran</a>.
          Thanks mate, your snippet saved me an awful lot of headache! :)
        </p>
        <p>
          To be honest, the visualisation has been inspired as well... :) This time
          by <a href='https://github.com/Rathachai/d3rdf/blob/master/index.html' target='_blank'>this implementation</a>
          by <a href='https://github.com/Rathachai' target='_blank'>Rathachai CHAWUTHAI</a>. Thanks!
        </p>
        <p>
          The app is completely Open Source and you can check it out
          at <a href='https://github.com/honzikec/turtlepen' target='_blank' title='GitHub'>
            <span className='ico-github'></span></a>. Feel free to create PRs, file issues,
        fork it, modify it to your needs or even tell me it sucks on
          my <a href='https://github.com/honzikec/turtlepen' target='_blank' title='Twitter'>
            <span className='ico-twitter'></span></a>.
        </p>
        <p>
          Oh, and also check out this cool CMS of ours at <a href='https://7divs.com/' target='_blank'>7divs.com</a>!
          Cheers and enjoy your linked data editing!
        </p>
        <p>
          <em>P.S. Yes - the name and look
              was pretty much inspired by <a href='https://codepen.io/' target='_blank'>CodePen</a> :)</em>
        </p>
      </section>
    );
  }
}
