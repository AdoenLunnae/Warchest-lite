export enum GameErrorCause {
    NoPieceToMove = "There's no piece to move there",
    OcuppiedTargetSquare = 'The target square is occupied',
    InvalidMove = 'That move is invalid',
    NoControlZone = "There's no control zone there",
    InactivePlayerMove = 'That piece belongs to the other player',
    InvalidPlacement = "You can't place a piece there",
    NoPieceToPlace = "You don't have that piece",
    FriendlyFire = "You can't attack your own unit",
    NoAttackTarget = "There's no piece to attack in that square",
    InvalidAttack = "That piece can't attack there",
    NoPieceToAttackWith = "There's no piece to attack with",
    InactivePlayerAttack = 'That piece belongs to the other player',
    UnmatchingPieces = 'The target piece is not the same type as the discarded one',
    NoPieceToControlWith = "You don't have a piece in that control zone",
    NoPieceToDiscard = "You don't have that type of piece in your hand",
}

export class GameError extends Error {
    private constructor(stack?: string) {
        super(stack);
    }

    public static withCause(cause: GameErrorCause): GameError {
        return new this(cause);
    }
}
