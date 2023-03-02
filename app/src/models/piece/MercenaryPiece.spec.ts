import { MercenaryPiece } from './MercenaryPiece';
import { PieceType } from './PieceType';

describe('Mercenary Piece', () => {
    let mercenary: MercenaryPiece;

    beforeEach(() => {
        mercenary = new MercenaryPiece();
    });
    test('there are 5 mercenaries', () => {
        expect(mercenary.totalNumber).toBe(5);
    });

    it('should have the mercenary type', () => {
        expect(mercenary.type).toBe(PieceType.MERCENARY);
    });
});
