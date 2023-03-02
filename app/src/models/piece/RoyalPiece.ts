import { Piece } from './Piece';
import { PieceType } from './PieceType';

export class RoyalPiece extends Piece {
    protected static readonly _type: PieceType = PieceType.ROYAL;
    protected static readonly _totalNumber: number = 1;
}
