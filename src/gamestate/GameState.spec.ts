import { ControlledPiece, GameState } from './GameState';
import { Piece, PieceFactory, PieceType } from '../models/piece';
import { Position } from '../models/position';
import { GameError, GameErrorCause } from './GameError';

describe('Game State', () => {
    var gs: GameState;

    beforeEach(() => {
        gs = new GameState();
    });

    describe('.toString', () => {
        it('formats to string', () => {
            expect(gs.toString()).toContain(
                '\
    0  1  2  3  4 \n\
   _______________\n\
a|  .  C  .  .  . \n\
b|  .  .  @  .  . \n\
c|  .  @  .  @  . \n\
d|  .  .  @  .  . \n\
e|  .  .  .  W  . \n\
==== CROW (^) ====',
            );
        });

        it('formats to string with pieces', () => {
            const pieces: ControlledPiece[] = [
                {
                    piece: PieceFactory.pieceOfType(PieceType.ARCHER),
                    controller: gs['_crow'],
                },
                {
                    piece: PieceFactory.pieceOfType(PieceType.SWORDSMAN),
                    controller: gs['_wolf'],
                },
            ];
            pieces[0].piece['_position'] = Position.from(2, 'a');
            pieces[1].piece['_position'] = Position.from(3, 'd');
            gs['_piecesInPlay'] = pieces;
            expect(gs.toString()).toContain(
                '\
    0  1  2  3  4 \n\
   _______________\n\
a|  .  C  A^ .  . \n\
b|  .  .  @  .  . \n\
c|  .  @  .  @  . \n\
d|  .  .  @  Sv . \n\
e|  .  .  .  W  . \n\
==== CROW (^) ====\
',
            );
        });
    });

    describe('Turn Tracking', () => {
        it('tracks turns when initiative is not modified', () => {
            expect(gs.activePlayer).toBe(gs.crow);
            expect(gs.turnEnd).toBeFalsy();

            gs.passTurn();
            expect(gs.activePlayer).toBe(gs.wolf);
            expect(gs.turnEnd).toBeTruthy();

            gs.passTurn();
            expect(gs.activePlayer).toBe(gs.crow);
            expect(gs.turnEnd).toBeFalsy();
        });

        it('tracks turns when initiative is modified', () => {
            expect(gs.activePlayer).toBe(gs.crow);
            expect(gs.turnEnd).toBeFalsy();

            gs.passTurn();
            expect(gs.activePlayer).toBe(gs.wolf);
            expect(gs.turnEnd).toBeTruthy();

            gs['_hasTheInitiative'] = gs.wolf;

            gs.passTurn();
            expect(gs.activePlayer).toBe(gs.wolf);
            expect(gs.turnEnd).toBeFalsy();
        });
    });

    describe('Piece Movement', () => {
        it('can move pieces', () => {
            gs['_piecesInPlay'] = [
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.ARCHER,
                        Position.from(2, 'a'),
                    ),
                    controller: gs.crow,
                },
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.SWORDSMAN,
                        Position.from(3, 'd'),
                    ),
                    controller: gs.wolf,
                },
            ];
            gs.crow['_hand'] = [PieceFactory.pieceOfType(PieceType.ARCHER)];
            gs.attemptMove(
                PieceType.ARCHER,
                Position.from(2, 'a'),
                Position.from(3, 'a'),
            );
            expect(gs.at(0, 2).controlledPiece).toBeNull();
            expect(gs.at(0, 3).controlledPiece).not.toBeNull();
            expect(gs.at(0, 3).controlledPiece.piece.type).toBe(
                PieceType.ARCHER,
            );
            expect(gs.at(0, 3).controlledPiece.controller).toBe(gs.crow);
            expect(gs.crow.handIsEmpty).toBeTruthy();
            expect(gs.crow['_discard']).toEqual(
                expect.arrayContaining([
                    PieceFactory.pieceOfType(PieceType.ARCHER),
                ]),
            );
        });

        it('throws when attempting to move nonexistent piece', () => {
            expect(() => {
                gs.attemptMove(
                    PieceType.ARCHER,
                    Position.from(2, 'a'),
                    Position.from(3, 'a'),
                );
            }).toThrowError(GameError.withCause(GameErrorCause.NoPieceToMove));
        });

        it('throws when attempting to move to an occupied square', () => {
            gs['_piecesInPlay'] = [
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.ARCHER,
                        Position.from(2, 'a'),
                    ),
                    controller: gs.crow,
                },
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.SWORDSMAN,
                        Position.from(3, 'a'),
                    ),
                    controller: gs.wolf,
                },
            ];
            gs.crow['_hand'] = [PieceFactory.pieceOfType(PieceType.ARCHER)];
            expect(() => {
                gs.attemptMove(
                    PieceType.ARCHER,
                    Position.from(2, 'a'),
                    Position.from(3, 'a'),
                );
            }).toThrowError(
                GameError.withCause(GameErrorCause.OcuppiedTargetSquare),
            );
        });

        it('throws when attempting to move a piece from the inactive player', () => {
            const pieces: ControlledPiece[] = [
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.SWORDSMAN,
                        Position.from(2, 'a'),
                    ),
                    controller: gs['_wolf'],
                },
            ];

            gs['_piecesInPlay'] = pieces;

            expect(() => {
                gs.attemptMove(
                    PieceType.ARCHER,
                    Position.from(2, 'a'),
                    Position.from(2, 'b'),
                );
            }).toThrowError(
                GameError.withCause(GameErrorCause.InactivePlayerMove),
            );
        });

        it("throws when you can't discard", () => {
            gs['_piecesInPlay'] = [
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.ARCHER,
                        Position.from(2, 'a'),
                    ),
                    controller: gs.crow,
                },
            ];

            gs.crow['_hand'] = [];
            expect(() => {
                gs.attemptMove(
                    PieceType.ARCHER,
                    Position.from(2, 'a'),
                    Position.from(3, 'a'),
                );
            }).toThrowError(
                GameError.withCause(GameErrorCause.NoPieceToDiscard),
            );
        });
    });

    describe('Piece Placement', () => {
        it('can place pieces from hand', () => {
            const hand: Piece[] = [PieceFactory.pieceOfType(PieceType.ARCHER)];

            gs.crow['_hand'] = [...hand];

            gs.attemptPlace(PieceType.ARCHER, Position.from(1, 'b'));

            expect(gs.at(1, 1).controlledPiece.piece).not.toBeNull();
            expect(gs.at(1, 1).controlledPiece.piece.type).toBe(
                PieceType.ARCHER,
            );
            expect(gs.at(1, 1).controlledPiece.controller).toBe(gs.crow);
        });

        it('throws when attempting to place in an occupied zone', () => {
            const pieces: ControlledPiece[] = [
                {
                    piece: PieceFactory.pieceOfType(PieceType.ARCHER),
                    controller: gs['_crow'],
                },
            ];
            pieces[0].piece['_position'] = Position.from(2, 'a');
            gs['_piecesInPlay'] = pieces;

            const hand: Piece[] = [PieceFactory.pieceOfType(PieceType.ARCHER)];
            gs.crow['_hand'] = [...hand];

            const placeAction = () => {
                gs.attemptPlace(PieceType.ARCHER, Position.from(2, 'a'));
            };

            expect(placeAction).toThrowError(
                GameError.withCause(GameErrorCause.OcuppiedTargetSquare),
            );
        });

        it('throws when attempting to place away from a control zone', () => {
            const hand: Piece[] = [PieceFactory.pieceOfType(PieceType.ARCHER)];

            gs.crow['_hand'] = [...hand];

            const placeAction = () => {
                gs.attemptPlace(PieceType.ARCHER, Position.from(3, 'b'));
            };

            expect(placeAction).toThrowError(
                GameError.withCause(GameErrorCause.InvalidPlacement),
            );
        });

        it('throws when attempting to place a piece that is not in hand', () => {
            const hand: Piece[] = [PieceFactory.pieceOfType(PieceType.ARCHER)];

            gs.crow['_hand'] = [...hand];

            const placeAction = () => {
                gs.attemptPlace(PieceType.BERSERKER, Position.from(1, 'b'));
            };

            expect(placeAction).toThrowError(
                GameError.withCause(GameErrorCause.NoPieceToPlace),
            );
        });
    });

    describe('Attacks', () => {
        const performAttack = () =>
            gs.attemptAttack(
                PieceType.ARCHER,
                Position.from(2, 'a'),
                Position.from(4, 'a'),
            );

        it('removes a piece that is attacked', () => {
            gs['_piecesInPlay'] = [
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.ARCHER,
                        Position.from(2, 'a'),
                    ),
                    controller: gs.crow,
                },
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.SWORDSMAN,
                        Position.from(4, 'a'),
                    ),
                    controller: gs.wolf,
                },
            ];
            gs.crow['_hand'] = [PieceFactory.pieceOfType(PieceType.ARCHER)];

            performAttack();

            expect(gs.at(0, 4).controlledPiece).toBeNull();
        });

        it('throws when attempting to attack from an empty square', () => {
            expect(performAttack).toThrowError(
                GameError.withCause(GameErrorCause.NoPieceToAttackWith),
            );
        });

        it("throws when attempting to attack with an opponent's piece", () => {
            gs['_piecesInPlay'] = [
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.ARCHER,
                        Position.from(2, 'a'),
                    ),
                    controller: gs.wolf,
                },
            ];

            expect(performAttack).toThrowError(
                GameError.withCause(GameErrorCause.InactivePlayerAttack),
            );
        });

        it('throws when attempting to attack an empty square', () => {
            gs['_piecesInPlay'] = [
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.ARCHER,
                        Position.from(2, 'a'),
                    ),
                    controller: gs.crow,
                },
            ];

            expect(performAttack).toThrowError(
                GameError.withCause(GameErrorCause.NoAttackTarget),
            );
        });

        it('throws when attempting to attack your own piece', () => {
            gs['_piecesInPlay'] = [
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.ARCHER,
                        Position.from(2, 'a'),
                    ),
                    controller: gs.crow,
                },
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.ARCHER,
                        Position.from(4, 'a'),
                    ),
                    controller: gs.crow,
                },
            ];

            expect(performAttack).toThrowError(
                GameError.withCause(GameErrorCause.FriendlyFire),
            );
        });

        it("throws when you can' discard", () => {
            gs['_piecesInPlay'] = [
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.ARCHER,
                        Position.from(2, 'a'),
                    ),
                    controller: gs.crow,
                },
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.ARCHER,
                        Position.from(4, 'a'),
                    ),
                    controller: gs.wolf,
                },
            ];

            gs.crow['_hand'] = [];

            expect(performAttack).toThrowError(
                GameError.withCause(GameErrorCause.NoPieceToDiscard),
            );
        });

        it('throws when you can', () => {
            gs['_piecesInPlay'] = [
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.BERSERKER,
                        Position.from(2, 'a'),
                    ),
                    controller: gs.crow,
                },
                {
                    piece: PieceFactory.pieceOfTypeAt(
                        PieceType.ARCHER,
                        Position.from(4, 'a'),
                    ),
                    controller: gs.wolf,
                },
            ];

            expect(performAttack).toThrowError(
                GameError.withCause(GameErrorCause.InvalidAttack),
            );
        });
    });
});
