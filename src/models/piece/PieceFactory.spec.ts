import { ArcherPiece } from './ArcherPiece';
import { BerserkerPiece } from './BerserkerPiece';
import { MercenaryPiece } from './MercenaryPiece';
import { PieceFactory } from './PieceFactory';
import { PieceTypes } from './PieceType';
import { SwordsmanPiece } from './SwordsmanPiece';

describe('PieceFactory', () => {
    it('Creates an Archer when archer type is passed', () => {
        expect(PieceFactory.pieceOfType(PieceTypes.ARCHER)).toBeInstanceOf(
            ArcherPiece,
        );
    });

    it('Creates a Berserker when berserker type is passed', () => {
        expect(PieceFactory.pieceOfType(PieceTypes.BERSERKER)).toBeInstanceOf(
            BerserkerPiece,
        );
    });

    it('Creates a Mercenary when mercenary type is passed', () => {
        expect(PieceFactory.pieceOfType(PieceTypes.MERCENARY)).toBeInstanceOf(
            MercenaryPiece,
        );
    });

    it('Creates a Swordsman when swordsman type is passed', () => {
        expect(PieceFactory.pieceOfType(PieceTypes.SWORDSMAN)).toBeInstanceOf(
            SwordsmanPiece,
        );
    });
});
