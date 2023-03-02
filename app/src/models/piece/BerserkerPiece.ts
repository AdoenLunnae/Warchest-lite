import { Piece } from './Piece';
import { PieceType } from './PieceType';

export class BerserkerPiece extends Piece {
    protected static readonly _type: PieceType = PieceType.BERSERKER;
    protected static readonly _totalNumber: number = 4;
}
