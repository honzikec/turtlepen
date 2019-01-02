import React, { Component, ChangeEvent } from 'react';
import './App.css';
import AceEditor from 'react-ace';
import * as n3 from 'n3';

import 'brace/mode/xml';
import 'brace/theme/twilight';
import CustomSqlMode from './AceCustomMode';
import { Chart } from './Chart';

interface IN3Token {
  line: number;
  prefix: string;
  type: string;
  value: string;
}

interface IN3Error extends Error {
  context?: {
    line: number;
    previousToken: IN3Token;
    token: IN3Token;
  }
}


class App extends Component<{}, { value: string, error?: IN3Error, triples?: Array<n3.Quad> }> {
  private _aceEditor: React.RefObject<any>;


  componentDidMount() {
    const customMode = new CustomSqlMode();
    if (this._aceEditor.current) {
      this._aceEditor.current.editor.getSession().setMode(customMode);
      this.validate();
    }
  }

  constructor(props: any) {
    super(props);
    this._aceEditor = React.createRef();
    this.state = {
      value:
        `@base <http://example.org/base/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dc: <http://purl.org/dc/elements/1.1/> .
@prefix ex: <http://example.org/stuff/1.0/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix frbr: <http://purl.org/vocab/frbr/core#> .
@prefix rel: <http://purl.org/vocab/relationship/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<http://www.w3.org/TR/rdf-syntax-grammar>
  dc:title "RDF/XML Syntax Specification (Revised)" ;
  ex:editor [
    ex:fullname "Dave Beckett";
    ex:homePage <http://purl.org/net/dajobe/>
  ] .

<http://www.w3.org/TR/rdf-syntax-grammar> <http://purl.org/dc/elements/1.1/title> "RDF/XML Syntax Specification (Revised)" .
<http://www.w3.org/TR/rdf-syntax-grammar> <http://example.org/stuff/1.0/editor> _:bnode .
_:bnode <http://example.org/stuff/1.0/fullname> "Dave Beckett" .
_:bnode <http://example.org/stuff/1.0/homePage> <http://purl.org/net/dajobe/> .

<http://books.example.com/works/45U8QJGZSQKDH8N> a frbr:Work ;
      dc:creator "Wil Wheaton"@en ;
      dc:title "Just a Geek"@en ;
      frbr:realization <http://books.example.com/products/9780596007683.BOOK>,
          <http://books.example.com/products/9780596802189.EBOOK> .

  <#green-goblin>
      rel:enemyOf <#spiderman> ;
      a foaf:Person ;    # in the context of the Marvel universe
      foaf:name "Green Goblin" .

  <#spiderman>
      rel:enemyOf <#green-goblin> ;
      a foaf:Person ;
      foaf:name "Spiderman", "Человек-паук"@ru .

@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix show: <http://example.org/vocab/show/> .

show:218 rdfs:label "That Seventies Show"^^xsd:string .            # literal with XML Schema string datatype
show:218 rdfs:label "That Seventies Show"^^<http://www.w3.org/2001/XMLSchema#string> . # same as above
show:218 rdfs:label "That Seventies Show" .                                            # same again
show:218 show:localName "That Seventies Show"@en .                 # literal with a language tag
show:218 show:localName 'Cette Série des Années Soixante-dix'@fr . # literal delimited by single quote
show:218 show:localName "Cette Série des Années Septante"@fr-be .  # literal with a region subtag

# I didn't bother with multi-line strings - I think you have to use multi-line
# begin...end captures to do this in Sublime, which is quite a big change from
# the regex I wrote for the SPARQL syntax.
# show:218 show:blurb '''This is a multi-line                        # literal with embedded new lines and quotes
# literal with many quotes (""""")
# and up to two sequential apostrophes ('').''' .

@prefix : <http://example.org/stats> .
<http://somecountry.example/census2007>
    :censusYear 2007 ;              # xsd:integer
    :birthsPerPerson .0135 ;        # xsd:decimal
    :gdpDollars 14074.2E9 .         # xsd:double

@prefix : <http://example.org/stats> .
<http://somecountry.example/census2007>
    :isLandlocked false .           # xsd:boolean

@prefix foaf: <http://xmlns.com/foaf/0.1/> .

_:alice foaf:knows _:bob .
_:bob foaf:knows _:alice .`
    };

    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  parse(): Promise<Array<n3.Quad>> {
    return new Promise((resolve, reject) => {
      let parser = n3.Parser({ format: 'text/turtle' });
      let triples: Array<n3.Quad> = [];
      let editor = this._aceEditor.current.editor.getSession();
      editor.clearAnnotations();
      parser.parse(this.state.value, (error: IN3Error, triple: n3.Quad, prefixes: n3.Prefixes) => {
        if (error) {
          this.setState({ error: error });
          editor.setAnnotations([{
            row: error.context ? error.context.line - 1 : 1,
            text: error.message,
            type: 'error'
          }]);
        } else if (triple) {
          triples.push(triple);
        }
        resolve(triples);
      })
    });
  }

  validate(): void {
    this.setState({ error: undefined });
    this.parse().then((triples: Array<n3.Quad>) => {
      this.setState({ triples: triples });
    });
  }

  handleChange(value: string, event: any): void {
    this.setState({ value: value });
    this.validate();
  }

  render() {
    let chart = this.state.error && this.state.error !== null ? '' : <Chart triples={this.state.triples} />;
    return (
      <div>
        <p>{this.state.error && this.state.error.message}</p>
        <AceEditor
          ref={this._aceEditor}
          mode="text"
          theme="twilight"
          onChange={this.handleChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          value={this.state.value}
        />
        {chart}
      </div>
    );
  }
}

export default App;
