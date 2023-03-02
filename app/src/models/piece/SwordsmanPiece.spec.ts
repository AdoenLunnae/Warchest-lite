import { SwordsmanPiece } from './SwordsmanPiece';
import { PieceType } from './PieceType';

describe('Swordsman Piece', () => {
    let swordsman: SwordsmanPiece;

    beforeEach(() => {
        swordsman = new SwordsmanPiece();
    });
    test('there are 4 swordsmen', () => {
        expect(swordsman.totalNumber).toBe(4);
    });

    it('should have the mercenary type', () => {
        expect(swordsman.type).toBe(PieceType.SWORDSMAN);
    });
});
