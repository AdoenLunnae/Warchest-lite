import Position from '../position/position';
import { PieceType } from './PieceType';

export interface Piece {
    readonly type: PieceType;
    _position: Position;
    readonly totalNumber: number;

    getMoves(boardSize: number): Array<Position>;
    getAttackedSquares(boardSize: number): Array<Position>;
    get position(): Position;
}
