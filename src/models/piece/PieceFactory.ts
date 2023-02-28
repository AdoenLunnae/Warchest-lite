import { Piece } from './Piece';
import { ArcherPiece } from './ArcherPiece';
import { BerserkerPiece } from './BerserkerPiece';
import { MercenaryPiece } from './MercenaryPiece';
import { SwordsmanPiece } from './SwordsmanPiece';
import { PieceType, PieceTypes } from './PieceType';

export default abstract class PieceFactory {
    public static pieceOfType(type: PieceType): Piece {
        switch (type) {
            case PieceTypes.ARCHER:
                return new ArcherPiece();
            case PieceTypes.BERSERKER:
                return new BerserkerPiece();
            case PieceTypes.MERCENARY:
                return new MercenaryPiece();
            case PieceTypes.SWORDSMAN:
                return new SwordsmanPiece();
        }
    }
}
