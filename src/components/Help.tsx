/* Copyright 2019 Jan Kaiser */

import React, { Component } from 'react';
import logo from './../assets/logo.svg';

export class Help extends Component {
  public render(): JSX.Element {
    return (
      <section className='page'>
        <h1>How to use <img title='TurtlePen' src={logo} className='page__logo' /></h1>
        <p>
          The app is designed to allow an intuitive editing experience but I totally get how it could get frustrating
          sometimes :) That's why there's this short guide to help you get familiar with TurtlePen.
        </p>
        <h2>Writing TURTLE</h2>
        <p>
          On the main screen, there's a box intended for writing your document. It will highlight your syntax,
          show you line numbers and errors in your markup.
        </p>
        <p>
          You can either start writing from scratch or, if you already have some work in progress, you can import it
          as text file <em>(e.g. *.ttl, *.txt or *.rdf)</em>.
        </p>
        <h2>Importing and exporting</h2>
        <p>
          Importing is very easy - you either click on the "Select
          or drop file to import turtle..." button in the top left and select the file from your filesystem or you can
          simply drag and drop your file directly on the button - it will turn green if you drag a valid file over it.
          The editor content will update immediately after uploading a valid file.
        </p>
        <p>
          Although your work is continuously saved to your browser's local storage, you might want to save it into
          a file to archive it or share it with someone. That is also easy - you simply click on the "Export as file..."
          button and current content of the editor will download to your computer as a <em>.ttl</em> file.
        </p>
        <h2>Visualisation</h2>
        <p>
          On the right part of your main screen, you should see a stripe with an icon representing chart. That is
          actually a button that toggles the chart view. When you click it, it will display a nice chart representing
          all the triples you just wrote manually (that is if they're valid, of course).
        </p>
        <p>
          If the chart is too big or too small, don't worry! You can drag the chart around freely.
          In the top right area of the chart, there are also zooming controls - by clicking them,
          you should be able to zoom the chart in and out according to your needs.
        </p>
        <p>
          But the chart lacks the actual IRIs and literals, it's just the graphic elements, you say?
          Well, in more complex structures, the text would be completely unreadable, so the chart rather
          hides it by default. But don't worry - try hovering over some element of the chart - see?
          It shows the corresponding IRI or literal on hover so we're sure it's readable :)
        </p>
        <p>
          Of course if there are no triples or there's a parsing error in your TURTLE, the chart cannot
          be constructed. So instead it will show you a message informing you about that. But don't worry,
          once you fix the error, it will automatically show the chart again.
        </p>
        <p>
          Happy turtling!
        </p>
      </section>
    );
  }
}
