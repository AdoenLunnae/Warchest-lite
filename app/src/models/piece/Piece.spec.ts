import { Piece } from './Piece';
import { Position } from '../position';

describe('Base Piece', () => {
    let piece: Piece;

    beforeEach(() => {
        piece = new Piece();
    });
    it.each`
        x    | y    | expectedPositions
        ${1} | ${1} | ${[[1, 0], [1, 2], [0, 1], [2, 1]]}
        ${1} | ${2} | ${[[1, 1], [1, 3], [0, 2], [2, 2]]}
        ${1} | ${3} | ${[[1, 2], [1, 4], [0, 3], [2, 3]]}
        ${2} | ${1} | ${[[2, 0], [2, 2], [1, 1], [3, 1]]}
        ${2} | ${2} | ${[[2, 1], [2, 3], [1, 2], [3, 2]]}
        ${2} | ${3} | ${[[2, 2], [2, 4], [1, 3], [3, 3]]}
        ${3} | ${1} | ${[[3, 0], [3, 2], [2, 1], [4, 1]]}
        ${3} | ${2} | ${[[3, 1], [3, 3], [2, 2], [4, 2]]}
        ${3} | ${3} | ${[[3, 2], [3, 4], [2, 3], [4, 3]]}
    `('can move orthogonaly from $x, $y', ({ x, y, expectedPositions }) => {
        piece.moveTo(Position.fromInts(x, y));

        const expected = expectedPositions.map((coords: number[]) =>
            Position.fromInts(coords[0], coords[1]),
        );

        const moves = piece.getMoves();

        expect(moves.length).toEqual(expected.length);
        expect(moves).toEqual(expect.arrayContaining(expected));
    });

    it('can be moved with moveTo', () => {
        const positions = [
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
        ];
        positions.forEach((position) => {
            piece.moveTo(Position.fromInts(position.x, position.y));
            expect(piece.position).toStrictEqual(
                Position.fromInts(position.x, position.y),
            );
        });
    });

    it.each`
        x    | y    | expectedPositions
        ${1} | ${1} | ${[[2, 1], [2, 2], [1, 2], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0]]}
        ${1} | ${2} | ${[[2, 2], [2, 3], [1, 3], [0, 3], [0, 2], [0, 1], [1, 1], [2, 1]]}
        ${1} | ${3} | ${[[2, 3], [2, 4], [1, 4], [0, 4], [0, 3], [0, 2], [1, 2], [2, 2]]}
        ${2} | ${1} | ${[[3, 1], [3, 2], [2, 2], [1, 2], [1, 1], [1, 0], [2, 0], [3, 0]]}
        ${2} | ${2} | ${[[3, 2], [3, 3], [2, 3], [2, 3], [1, 2], [1, 1], [2, 1], [3, 1]]}
        ${2} | ${3} | ${[[3, 3], [3, 4], [2, 4], [1, 4], [1, 3], [1, 2], [2, 2], [3, 2]]}
        ${3} | ${1} | ${[[4, 1], [4, 2], [3, 2], [2, 2], [2, 1], [2, 0], [3, 0], [4, 0]]}
        ${3} | ${2} | ${[[4, 2], [4, 3], [3, 3], [2, 3], [2, 2], [2, 1], [3, 1], [4, 1]]}
        ${3} | ${3} | ${[[4, 3], [4, 4], [3, 4], [2, 4], [2, 3], [2, 2], [3, 2], [4, 2]]}
    `('can attack adjacent squares', ({ x, y, expectedPositions }) => {
        piece.moveTo(Position.fromInts(x, y));

        const expected = expectedPositions.map((coords: number[]) =>
            Position.fromInts(coords[0], coords[1]),
        );

        const attacks = piece.getAttackedSquares();

        expect(attacks.length).toEqual(expected.length);
        expect(attacks).toEqual(expect.arrayContaining(expected));
    });

    /* 
        In the following tests we only check the number of results,
        since we know the behaviour is correct from the previous ones
    */
    it.each`
        x    | y    | numValidPositions
        ${0} | ${0} | ${2}
        ${0} | ${1} | ${3}
        ${0} | ${2} | ${3}
        ${0} | ${3} | ${3}
        ${0} | ${4} | ${2}
        ${1} | ${0} | ${3}
        ${1} | ${4} | ${3}
        ${2} | ${0} | ${3}
        ${2} | ${4} | ${3}
        ${3} | ${0} | ${3}
        ${3} | ${4} | ${3}
        ${4} | ${0} | ${2}
        ${4} | ${1} | ${3}
        ${4} | ${2} | ${3}
        ${4} | ${3} | ${3}
        ${4} | ${4} | ${2}
    `("can't move outside the board", ({ x, y, numValidPositions }) => {
        piece.moveTo(Position.fromInts(x, y));

        const moves = piece.getMoves();

        expect(moves.length).toEqual(numValidPositions);
    });

    it.each`
        x    | y    | numValidAttacks
        ${0} | ${0} | ${3}
        ${0} | ${4} | ${3}
        ${4} | ${0} | ${3}
        ${4} | ${4} | ${3}
        ${0} | ${1} | ${5}
        ${0} | ${2} | ${5}
        ${0} | ${3} | ${5}
        ${1} | ${0} | ${5}
        ${1} | ${4} | ${5}
        ${2} | ${0} | ${5}
        ${2} | ${4} | ${5}
        ${3} | ${0} | ${5}
        ${3} | ${4} | ${5}
        ${4} | ${1} | ${5}
        ${4} | ${2} | ${5}
        ${4} | ${3} | ${5}
    `("can't attack outside the board", ({ x, y, numValidAttacks }) => {
        piece.moveTo(Position.fromInts(x, y));

        const attacks = piece.getAttackedSquares();

        expect(attacks.length).toEqual(numValidAttacks);
    });
});
