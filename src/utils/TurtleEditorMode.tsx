/* Copyright 2019 Jan Kaiser */

import 'brace/mode/text';
import ace from 'brace';

export class CustomHighlightRules extends ace.acequire(
    'ace/mode/text_highlight_rules'
).TextHighlightRules {

    constructor() {
        super();

        this.$rules = {
            start: [
                {
                    comment: 'Keywords',
                    regex: '(?:^|\\s+)(?:@base|@prefix)\\b',
                    token: 'keyword.turtle'
                },
                {
                    comment: 'URI',
                    // Best attempt to convert IRI_REF:
                    // http://www.w3.org/TR/rdf-sparql-query/#rIRI_REF
                    regex: '<[^<>"{}|^`\\]\\\\]*>',
                    token: 'string.uri.turtle'
                },
                {
                    captures: {
                        1: { token: 'constant.language.turtle' },
                        2: { token: 'entity.name.class.turtle' }
                    },
                    comment: 'Blank node',
                    regex: '(_:)([^\\s]+)',
                    token: 'constant.complex.blank-node.turtle'
                },
                {
                    captures: {
                        1: { token: 'constant.other.turtle' },
                        2: { token: 'entity.name.class.turtle' }
                    },
                    comment: 'Prefix / prefixed URI',
                    // PN_CHARS_BASE is insane
                    // http://www.w3.org/TR/rdf-sparql-query/#rPN_CHARS_BASE
                    regex: '(\\w*:)([^\\s|/^*?+{}()]*)',
                    token: 'constant.complex.turtle'
                },
                {
                    comment: 'The special triple predicate \'a\'',
                    regex: '\\sa\\s',
                    token: 'entity.name.class.rdfs-type.turtle'
                },
                {
                    captures: {
                        1: { token: 'string.turtle' },
                        2: { token: 'keyword.operator.turtle' },
                        3: { token: 'support.type.turtle' }
                    },
                    comment: 'Typed literal',
                    regex: '("[^"]*")(\\^\\^)(<[^<>"{}|^`\\]\\\\]*>|\\w*:[^\\s)]+)',
                    // Note duplication of IRI_REF
                    token: 'literal.turtle'
                },
                {
                    captures: {
                        1: { token: 'string.turtle' },
                        2: { token: 'keyword.operator.turtle' },
                        3: { token: 'support.type.turtle' }
                    },
                    comment: 'String literal',
                    // This is an attempt to implement the following BNF combinations:
                    // STRING_LITERAL_LONG1 | STRING_LITERAL_LONG2 | STRING_LITERAL1 | STRING_LITERAL2
                    // Creating an incorrectly highlighted example of a triple-quoted string
                    // turned out to be really hard, so I can't promise the first two options
                    // are correct!
                    //
                    // I didn't bother with multi-line strings - I think you have to use multi-line
                    // begin...end captures to do this in Sublime, which is quite a big change from
                    // the regex I wrote for the SPARQL syntax.
                    // tslint:disable-next-line:max-line-length
                    regex: '(\'\'\'(?:(?:\'|\'\')?(?:[^\'\\\\]|\\\\[tbnrf\\"\']))*\'\'\'|"""(?:(?:"|"")?([^"\\\\]|\\\\[tbnrf\\"\']))*"""|\'(?:(?:[^\\x22\\x5C\\xA\\xD])|\\\\[tbnrf\\"\'])*\'|"(?:(?:[^\\x22\\x5C\\xA\\xD])|\\\\[tbnrf\\"\'])*"|\'\'\'.*\'\'\'|\'[^\']*\')(@[a-zA-Z-]+)?',
                    token: 'string.turtle'
                },
                {
                    comment: 'Comments',
                    regex: '#.*$',
                    token: 'comment.line.number-sign.turtle'
                },
                {
                    comment: 'Numeric literal',
                    regex: '\\b[+-]?(?:\\d+|[0-9]+\\.[0-9]*|\\.[0-9]+(?:[eE][+-]?\\d+)?)\\b',
                    token: 'constant.numeric.turtle'
                },
                {
                    comment: 'Boolean',
                    regex: '\\b(?:true|false)\\b',
                    token: 'constant.language.turtle'
                }
            ]
        };
    }
}

export class TurtleEditorMode extends ace.acequire('ace/mode/text')
    .Mode {
    constructor() {
        super();
        this.HighlightRules = CustomHighlightRules;
    }
}
