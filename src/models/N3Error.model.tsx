import { N3Token } from "./N3Token.model";

export interface N3Error extends Error {
    context?: {
        line: number;
        previousToken: N3Token;
        token: N3Token;
    }
}