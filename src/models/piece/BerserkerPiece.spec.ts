import { BerserkerPiece } from './BerserkerPiece';
import { PieceType } from './PieceType';

describe('Berserker Piece', () => {
    let berserker: BerserkerPiece;

    beforeEach(() => {
        berserker = new BerserkerPiece();
    });
    test('there are 4 berserkers', () => {
        expect(berserker.totalNumber).toBe(4);
    });

    it('should have the berserker type', () => {
        expect(berserker.type).toBe(PieceType.BERSERKER);
    });
});
