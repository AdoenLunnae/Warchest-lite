import Position from '../../position/position';
import { PieceType } from '../PieceType';

export class InvalidMoveError extends Error {
    private constructor(stack?: string) {
        super(stack);
    }

    public static with(
        pieceName: PieceType,
        origin: Position,
        target: Position,
    ) {
        return new this(
            `${pieceName.long} cannot move from ${origin} to ${target}`,
        );
    }
}
