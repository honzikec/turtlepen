/* Copyright 2018 Jan Kaiser */

import { N3Error } from './N3Error.model';
import * as n3 from 'n3';

export interface EditorState {
    value: string;
    error?: N3Error;
    triples?: Array<n3.Quad>;
}
