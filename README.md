TurtlePen is an academic project written in [React.js](https://reactjs.org/) that allows simple and intuitive editing, validation and visualisation of [TURTLE](https://www.w3.org/TR/turtle/). It will also work for any other documents in the [N3Notation](https://www.w3.org/TeamSubmission/n3/) but the syntax highlighting might not be perfect. It was written as a part of an assignement for a Linked Data course at the [University of Economics in Prague](https://www.vse.cz/english/).

Running version of TurtlePen can be found at [turtlepen.app](https://turtlepen.app/).

Apart from React.js, the app also heavily depends on [N3.js](https://github.com/rdfjs/N3.js) (used for parsing and validation), [react-ace](https://github.com/securingsincity/react-ace) (a wrapper for [ACE editor](https://github.com/ajaxorg/ace)) and on [d3](https://github.com/d3/d3) data visualisation library.

Syntax highlighting rules were heavily inspired by [this implementation for Sublime](https://github.com/patchspace/sparql-sublime/blob/master/turtle.tmLanguage.JSON) by [Ash Moran](https://github.com/ashmoran). Thanks mate, your snippet saved me an awful lot of headache! :)

To be honest, the visualisation has been inspired as well... :) This time by [this implementation](https://github.com/Rathachai/d3rdf/blob/master/index.html) by [Rathachai CHAWUTHAI](https://github.com/Rathachai). Thanks!

The application is completely Open Source and you are free to use and modify it in whichever way you please. PRs and issues are welcome.

P.S. Yes - the name and look was pretty much inspired by CodePen :)
