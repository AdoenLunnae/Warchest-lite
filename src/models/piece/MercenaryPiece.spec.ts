import { MercenaryPiece } from './MercenaryPiece';
import { PieceTypes } from './PieceType';

describe('Mercenary Piece', () => {
    let mercenary: MercenaryPiece;

    beforeEach(() => {
        mercenary = new MercenaryPiece();
    });
    test('there are 5 mercenaries', () => {
        expect(mercenary.totalNumber).toBe(5);
    });

    it('should have the mercenary type', () => {
        expect(mercenary.type).toBe(PieceTypes.MERCENARY);
    });
});
