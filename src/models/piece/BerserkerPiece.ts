import { Piece } from './Piece';
import { PieceType, PieceTypes } from './PieceType';

export class BerserkerPiece extends Piece {
    protected static readonly _type: PieceType = PieceTypes.BERSERKER;
    protected static readonly _totalNumber: number = 4;
}
