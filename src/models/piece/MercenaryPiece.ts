import { Piece } from './Piece';
import { PieceType, PieceTypes } from './PieceType';

export class MercenaryPiece extends Piece {
    protected static readonly _type: PieceType = PieceTypes.MERCENARY;
    protected static readonly _totalNumber: number = 5;
}
