import { Piece } from './Piece';
import { PieceType, PieceTypes } from './PieceType';

export class BerserkerPiece extends Piece {
    readonly type: PieceType = PieceTypes.BERSERKER;
    readonly totalNumber: number = 4;
}
