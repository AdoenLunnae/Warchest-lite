import { Piece } from './Piece';
import { PieceType } from './PieceType';

export class SwordsmanPiece extends Piece {
    protected static readonly _type: PieceType = PieceType.SWORDSMAN;
    protected static readonly _totalNumber: number = 4;
}
