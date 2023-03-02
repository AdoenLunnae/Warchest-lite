import { Piece } from './Piece';
import { PieceType } from './PieceType';

export class MercenaryPiece extends Piece {
    protected static readonly _type: PieceType = PieceType.MERCENARY;
    protected static readonly _totalNumber: number = 5;
}
