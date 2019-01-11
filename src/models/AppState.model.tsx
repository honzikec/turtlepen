/* Copyright 2019 Jan Kaiser */

import { EditorState } from './EditorState.model';

export interface AppState extends EditorState {
    showChart: boolean;
}
