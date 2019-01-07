/* Copyright 2018 Jan Kaiser */

import { EditorState } from './EditorState.model';

export interface EditorChangeProps {
    onEditorChanged: (editorState: EditorState) => void;
    smaller: boolean;
}
