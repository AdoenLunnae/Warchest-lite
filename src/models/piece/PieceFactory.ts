import { Piece } from './Piece';
import { ArcherPiece } from './ArcherPiece';
import { BerserkerPiece } from './BerserkerPiece';
import { MercenaryPiece } from './MercenaryPiece';
import { SwordsmanPiece } from './SwordsmanPiece';
import { PieceType } from './PieceType';

export class PieceFactory {
    private constructor() {}
    public static pieceOfType(type: PieceType): Piece {
        switch (type) {
            case PieceType.ARCHER:
                return new ArcherPiece();
            case PieceType.BERSERKER:
                return new BerserkerPiece();
            case PieceType.MERCENARY:
                return new MercenaryPiece();
            case PieceType.SWORDSMAN:
                return new SwordsmanPiece();
            default:
                throw new Error('Invalid Piece Type');
        }
    }
}
