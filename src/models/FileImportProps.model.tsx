/* Copyright 2018 Jan Kaiser */

export interface FileImportProps {
    onFileImport: (result: string | ArrayBuffer | null) => void;
}
