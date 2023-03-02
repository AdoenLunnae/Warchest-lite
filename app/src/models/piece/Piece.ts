import {
    InvalidColNumberError,
    InvalidRowNumberError,
} from '../position/errors';
import { Position } from '../position';
import { PieceType } from './PieceType';
import { InvalidMoveError } from './errors';

export class Piece {
    protected static readonly _type: PieceType;
    protected static readonly _totalNumber: number;
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
        if (this.position === null) return this._allMoves();

        return this.position.getOrthogonallyAdjacent();
    }

    public getAttackedSquares(): Position[] {
        if (this.position === null) return [];

        return this.position.getAllAdjacent();
    }

    get position(): Position | null {
        return this._position;
    }

    public canMoveTo(targetPosition: Position): boolean {
        return this.getMoves().some(
            (i) => i.col === targetPosition.col && i.row === targetPosition.row,
        );
    }

    public canAttackTo(targetPosition: Position): boolean {
        return this.getAttackedSquares().some(
            (attackedPosition) =>
                attackedPosition.col == targetPosition.col &&
                attackedPosition.row === targetPosition.row,
        );
    }

    public placeAt(targetPosition: Position) {
        this._position = targetPosition;
    }

    public moveTo(targetPosition: Position) {
        if (this.position === null) {
            this.placeAt(targetPosition);
            return;
        }
        if (!this.canMoveTo(targetPosition)) {
            throw InvalidMoveError.with(
                this.type,
                this.position,
                targetPosition,
            );
        }

        this._position = targetPosition;
    }

    public get type() {
        return (this.constructor as typeof Piece)._type;
    }

    public get totalNumber() {
        return (this.constructor as typeof Piece)._totalNumber;
    }
}
