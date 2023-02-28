import { Position } from './position';
import {
    InvalidColNumberError,
    InvalidRowLetterError,
    InvalidRowNumberError,
} from './errors';

describe('Position', () => {
    it('creates from two integers', () => {
        const x = 2;
        const y = 3;
        const position = Position.fromInts(x, y);

        expect(position).toBeInstanceOf(Position);
        expect(position.x).toBe(x);
        expect(position.y).toBe(y);
    });

    it('creates from an int and a letter', () => {
        const col = 2;
        const row = 'd';
        const position = Position.from(col, row);

        expect(position).toBeInstanceOf(Position);
        expect(position.x).toBe(col);
        expect(position.y).toBe(3);
    });

    it('fails when an invalid number is passed as col', () => {
        const colNegative = -1;
        const colTooBig = 6;

        expect(() => Position.fromInts(colNegative, 0)).toThrowError(
            InvalidColNumberError.withNumber(colNegative),
        );

        expect(() => Position.fromInts(colTooBig, 0)).toThrowError(
            InvalidColNumberError.withNumber(colTooBig),
        );
    });

    it('fails when an invalid number is passed as row', () => {
        const rowNegative = -1;
        const rowTooBig = 6;

        expect(() => Position.fromInts(0, rowNegative)).toThrowError(
            InvalidRowNumberError.withNumber(rowNegative),
        );

        expect(() => Position.fromInts(0, rowTooBig)).toThrowError(
            InvalidRowNumberError.withNumber(rowTooBig),
        );
    });

    it('fails when an invalid letter is passed as row', () => {
        const invalidRow = ' ';
        const multiChar = 'abc';

        expect(() => Position.from(0, invalidRow)).toThrowError(
            InvalidRowLetterError.withString(invalidRow),
        );

        expect(() => Position.from(0, multiChar)).toThrowError(
            InvalidRowLetterError.withString(multiChar),
        );
    });
});
