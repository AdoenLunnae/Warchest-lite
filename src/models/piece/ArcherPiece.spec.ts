import Position from '../position/position';
import { ArcherPiece } from './ArcherPiece';
import { PieceTypes } from './PieceType';

describe('Archer Piece', () => {
    let archer: ArcherPiece;

    beforeEach(() => {
        archer = new ArcherPiece();
    });

    test('there are 4 archers', () => {
        expect(archer.totalNumber).toBe(4);
    });

    it('should have the archer type', () => {
        expect(archer.type).toBe(PieceTypes.ARCHER);
    });

    it('can shoot 2 squares orthogonal or diagonal', () => {
        archer.moveTo(Position.fromInts(2, 2));

        const expected = [
            [0, 0],
            [0, 2],
            [0, 4],
            [2, 0],
            [2, 4],
            [4, 0],
            [4, 2],
            [4, 4],
        ].map((coords) => Position.fromInts(coords[0], coords[1]));

        const attacks = archer.getAttackedSquares();

        expect(attacks.length).toEqual(expected.length);
        expect(attacks).toEqual(expect.arrayContaining(expected));
    });

    /* 
        In the following tests we only check the number of results,
        since we know the behaviour is correct from the previous ones
    */
    it.each`
        x    | y    | numValidAttacks
        ${0} | ${0} | ${3}
        ${0} | ${4} | ${3}
        ${4} | ${0} | ${3}
        ${4} | ${4} | ${3}
        ${0} | ${1} | ${3}
        ${0} | ${3} | ${3}
        ${1} | ${0} | ${3}
        ${1} | ${4} | ${3}
        ${3} | ${0} | ${3}
        ${3} | ${4} | ${3}
        ${4} | ${1} | ${3}
        ${4} | ${3} | ${3}
        ${0} | ${2} | ${5}
        ${2} | ${0} | ${5}
        ${2} | ${4} | ${5}
        ${4} | ${2} | ${5}
        ${1} | ${1} | ${3}
        ${1} | ${3} | ${3}
        ${3} | ${1} | ${3}
        ${3} | ${3} | ${3}
        ${1} | ${2} | ${5}
        ${2} | ${1} | ${5}
        ${2} | ${3} | ${5}
        ${3} | ${2} | ${5}
    `(
        "can't attack outside the board from $x, $y",
        ({ x, y, numValidAttacks }) => {
            archer.moveTo(Position.fromInts(x, y));
            const attacks = archer.getAttackedSquares();

            expect(attacks.length).toEqual(numValidAttacks);
        },
    );
});
