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
        return `{${this.x}, ${this.y}}`;
    }

    public get x() {
        return this._x;
    }

    private set x(newX: number) {
        this._x = newX;
    }

    public get y() {
        return this._y;
    }

    private set y(newY: number) {
        this._y = newY;
    }
}
