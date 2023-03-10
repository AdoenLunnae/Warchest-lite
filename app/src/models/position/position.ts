import {
    InvalidRowLetterError,
    InvalidColNumberError,
    InvalidRowNumberError,
} from './errors';

export class Position {
    private _x: number;
    private _y: number;

    private constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public static fromInts(x: number, y: number): Position {
        if (x < 0 || x > 4) throw InvalidColNumberError.withNumber(x);
        if (y < 0 || y > 4) throw InvalidRowNumberError.withNumber(y);
        return new this(x, y);
    }

    public static from(col: number, row: string): Position {
        if (row.length !== 1 || row < 'a' || row > 'e')
            throw InvalidRowLetterError.withString(row);

        const rowNumber = row.charCodeAt(0) - 'a'.charCodeAt(0);

        return this.fromInts(col, rowNumber);
    }

    public toString(): string {
        const rowLetter = String.fromCharCode('a'.charCodeAt(0) + this.row);
        return `(${rowLetter},${this.col})`;
    }

    public get col() {
        return this._x;
    }

    private set col(newX: number) {
        this._x = newX;
    }

    public get row() {
        return this._y;
    }

    private set row(newY: number) {
        this._y = newY;
    }

    public getFromDeltaList(
        possibilities: { deltaX: number; deltaY: number }[],
    ): Position[] {
        var result: Position[] = [];
        possibilities.forEach((possibility) => {
            try {
                result.push(
                    Position.fromInts(
                        this._x + possibility.deltaX,
                        this._y + possibility.deltaY,
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
        return result;
    }

    public getOrthogonallyAdjacent(): Position[] {
        const possible = [
            { deltaX: 1, deltaY: 0 },
            { deltaX: -1, deltaY: 0 },
            { deltaX: 0, deltaY: 1 },
            { deltaX: 0, deltaY: -1 },
        ];

        return this.getFromDeltaList(possible);
    }

    public getAllAdjacent(): Position[] {
        const possible = [
            { deltaX: 1, deltaY: 0 },
            { deltaX: -1, deltaY: 0 },
            { deltaX: 0, deltaY: 1 },
            { deltaX: 0, deltaY: -1 },
            { deltaX: 1, deltaY: 1 },
            { deltaX: 1, deltaY: -1 },
            { deltaX: -1, deltaY: 1 },
            { deltaX: -1, deltaY: -1 },
        ];

        return this.getFromDeltaList(possible);
    }
}
