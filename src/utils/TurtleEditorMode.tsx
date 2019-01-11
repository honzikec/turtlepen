/* Copyright 2019 Jan Kaiser */

import 'brace/mode/text';
import ace from 'brace';

/**
 * Custom regex rules for TURTLE syntax highlighting
 *
 * @export
 * @class CustomHighlightRules
 * @extends {ace.acequire('ace/mode/text_highlight_rules').TextHighlightRules}
 */
export class CustomHighlightRules extends ace.acequire(
    'ace/mode/text_highlight_rules'
).TextHighlightRules {

    constructor() {
        super();

        // Credit: Very heavily inspired by this:
        // https://github.com/patchspace/sparql-sublime/blob/master/turtle.tmLanguage.JSON

        this.$rules = {
            start: [
                {
                    comment: 'Keywords',
                    regex: '(?:^|\\s+)(?:@base|@prefix)\\b',
                    token: 'keyword.turtle'
                },
                {
                    comment: 'URI',
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
                    token: 'literal.turtle'
                },
                {
                    captures: {
                        1: { token: 'string.turtle' },
                        2: { token: 'keyword.operator.turtle' },
                        3: { token: 'support.type.turtle' }
                    },
                    comment: 'String literal',
                    // tslint:disable-next-line:max-line-length
                    regex: '(\'\'\'(?:(?:\'|\'\')?(?:[^\'\\\\]|\\\\[\t\b\n\r\f\\\"\']))*\'\'\'|\"\"\"(?:(?:\"|\"\")?([^\"\\\\]|\\\\[\t\b\n\r\f\\\"\']))*\"\"\"|\'(?:(?:[^\x22\x5C\x0A\x0D])|\\\\[\t\b\n\r\f\\\"\'])*\'|\"(?:(?:[^\x22\x5C\x0A\x0D])|\\\\[\t\b\n\r\f\\\"\'])*\"|\'\'\'.*\'\'\'|\'[^\']*\')(@[a-zA-Z-]+)?',
                    token: 'literal.turtle'
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
