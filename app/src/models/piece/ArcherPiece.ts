import {
    InvalidColNumberError,
    InvalidRowNumberError,
} from '../position/errors';
import { Position } from '../position';
import { Piece } from './Piece';
import { PieceType } from './PieceType';

export class ArcherPiece extends Piece {
    protected static readonly _type: PieceType = PieceType.ARCHER;
    protected static readonly _totalNumber: number = 4;

    public getAttackedSquares(): Position[] {
        if (this.position === null) return [];

        const possibleAttacks = [
            { deltaX: -2, deltaY: 0 },
            { deltaX: 2, deltaY: 0 },
            { deltaX: 0, deltaY: -2 },
            { deltaX: 0, deltaY: 2 },
            { deltaX: -2, deltaY: -2 },
            { deltaX: -2, deltaY: 2 },
            { deltaX: 2, deltaY: -2 },
            { deltaX: 2, deltaY: 2 },
        ];

        return this.position.getFromDeltaList(possibleAttacks);
    }
}
