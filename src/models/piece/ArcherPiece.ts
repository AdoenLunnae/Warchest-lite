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
        const x = this.position.x;
        const y = this.position.y;

        const possibleAttacks: Array<{ x: number; y: number }> = [
            { x: -2, y: 0 },
            { x: 2, y: 0 },
            { x: 0, y: -2 },
            { x: 0, y: 2 },
            { x: -2, y: -2 },
            { x: -2, y: 2 },
            { x: 2, y: -2 },
            { x: 2, y: 2 },
        ];
        var validAttacks = Array<Position>();

        possibleAttacks.forEach((attackPosition) => {
            try {
                validAttacks.push(
                    Position.fromInts(
                        x + attackPosition.x,
                        y + attackPosition.y,
                    ),
                );
            } catch (e) {
                if (
                    !(
                        e instanceof InvalidColNumberError ||
                        e instanceof InvalidRowNumberError
                    )
                )
                    throw e;
            }
        });
        return validAttacks;
    }
}
