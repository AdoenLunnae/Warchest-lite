import {
    InvalidColNumberError,
    InvalidRowNumberError,
} from '../position/errors';
import Position from '../position/position';
import { PieceType } from './PieceType';
import { InvalidMoveError } from './errors';

export class Piece {
    readonly type: PieceType;
    readonly totalNumber: number;
    _position: Position | null;

    constructor() {
        this._position = null;
    }

    protected _allMoves(): Position[] {
        var allMoves = Array<Position>();
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                allMoves.push(Position.fromInts(x, y));
            }
        }
        return allMoves;
    }

    public getMoves(): Position[] {
        const x = this._position.x;
        const y = this._position.y;

        var validMoves = Array<Position>();

        const possibleMoves: Array<{ x: number; y: number }> = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 },
        ];

        possibleMoves.forEach((targetPosition) => {
            try {
                validMoves.push(
                    Position.fromInts(
                        x + targetPosition.x,
                        y + targetPosition.y,
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

        return validMoves;
    }
    public getAttackedSquares(): Position[] {
        const x = this._position.x;
        const y = this._position.y;

        const possibleAttacks: Array<{ x: number; y: number }> = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: -1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: -1 },
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

    get position(): Position | null {
        return this._position;
    }

    public _canMoveTo(targetPosition: Position): boolean {
        return this.getMoves().some(
            (i) => i.x === targetPosition.x && i.y === targetPosition.y,
        );
    }

    public _canAttackTo(targetPosition: Position): boolean {
        return this.getAttackedSquares().includes(targetPosition);
    }

    public _placeAt(targetPosition: Position) {
        this._position = targetPosition;
    }

    public moveTo(targetPosition: Position) {
        if (this.position === null) {
            this._placeAt(targetPosition);
            return;
        }
        if (!this._canMoveTo(targetPosition)) {
            throw InvalidMoveError.with(
                this.type,
                this.position,
                targetPosition,
            );
        }

        this._position = targetPosition;
    }
}
