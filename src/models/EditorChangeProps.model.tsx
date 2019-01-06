import { EditorState } from "./EditorState.model";

export interface EditorChangeProps {
    onEditorChanged: (editorState: EditorState) => void;
}