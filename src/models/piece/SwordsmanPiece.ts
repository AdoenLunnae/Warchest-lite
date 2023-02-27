import { Piece } from './Piece';
import { PieceType, PieceTypes } from './PieceType';

export class SwordsmanPiece extends Piece {
    protected static readonly _type: PieceType = PieceTypes.SWORDSMAN;
    protected static readonly _totalNumber: number = 4;
}
