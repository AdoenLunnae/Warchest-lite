import { GameError } from './gamestate/GameError';
import { GameState } from './gamestate/GameState';
import { PieceType } from './models/piece';
import { Position } from './models/position';
import { waitInput } from './waitInput';

export class ActionHandler {
    static readonly validActions = [
        'move',
        'recruit',
        'place',
        'attack',
        'control',
        'initiative',
        'forfeit',
    ];

    private static async _promptForPiece(
        gs: GameState,
        verb: string,
        isDiscard: boolean = true,
        checkHand: boolean = true,
    ): Promise<PieceType> {
        const prompt = isDiscard
            ? `Select piece to discard from your hand to ${verb}: `
            : `Select piece to ${verb}: `;
        var pieceType: PieceType | undefined;
        var answer: string;
        var exit = false;
        while (!exit) {
            answer = await waitInput(prompt);
            pieceType = PieceType.fromString(answer);
            if (pieceType === undefined) console.log('Invalid pice type');
            else if (checkHand && !gs.activePlayer.hasPieceInHand(pieceType))
                console.log("You don't have that kind of piece");
            else exit = true;
        }

        return pieceType!;
    }

    private static async _prompForPosition(prompt: string): Promise<Position> {
        var answer: string;
        var position: Position;
        var exit = false;
        while (!exit) {
            answer = await waitInput(`${prompt} (row,col): `);
            var coords = answer.split(',');
            if (coords.length != 2) console.log('Invalid position format');
            else {
                try {
                    position = Position.from(parseInt(coords[1]), coords[0]);
                    exit = true;
                } catch (error: any) {
                    console.log(error.message);
                }
            }
        }

        return position!;
    }

    private static async _handleMove(gs: GameState) {
        var actionCompleted = false;
        while (!actionCompleted) {
            var pieceType = await this._promptForPiece(
                gs,
                'move piece of the same kind',
            );
            var fromPosition = await this._prompForPosition('From position');
            var toPosition = await this._prompForPosition('To position');
            try {
                gs.attemptMove(pieceType, fromPosition, toPosition);
                actionCompleted = true;
            } catch (error: any) {
                if (error instanceof GameError) console.log(error.message);
            }
        }
    }

    private static async _handleRecruitWithRoyal(gs: GameState) {
        var actionCompleted = false;
        while (!actionCompleted) {
            var pieceType = await this._promptForPiece(
                gs,
                'recruit using a Royal',
                false,
                false,
            );

            try {
                gs.attemptRecruit(pieceType, true);
                actionCompleted = true;
            } catch (error: any) {
                if (error instanceof GameError) console.log(error.message);
            }
        }
    }
    private static async _handleRecruit(gs: GameState) {
        var actionCompleted = false;
        while (!actionCompleted) {
            var pieceType = await this._promptForPiece(
                gs,
                'recruit piece of the same kind',
            );

            try {
                if (pieceType == PieceType.ROYAL)
                    await this._handleRecruitWithRoyal(gs);
                else gs.attemptRecruit(pieceType);
                actionCompleted = true;
            } catch (error: any) {
                if (error instanceof GameError) console.log(error.message);
            }
        }
    }

    private static async _handleSwordsmanFreeMove(
        gs: GameState,
        fromPosition: Position,
    ) {
        console.log('The swordsman can move for free after attacking.');
        var answer = await waitInput(
            'Do you want to move the swordsman? [default: yes] (yes/no)',
        );
        var actionCompleted: boolean = answer === 'no';
        while (!actionCompleted) {
            console.log(`Moving the swordsman from position ${fromPosition}`);
            var toPosition = await this._prompForPosition('To position');
            console.log(`Position chosen: ${toPosition}`);

            try {
                gs.attemptMove(
                    PieceType.SWORDSMAN,
                    fromPosition,
                    toPosition,
                    true,
                );
                actionCompleted = true;
            } catch (error: any) {
                if (error instanceof GameError) console.log(error.message);
            }
        }
    }

    private static async _handleBerserkerSecondAttack(
        gs: GameState,
        fromPosition: Position,
    ) {
        console.log('The berserker can attack twice.');
        var answer = await waitInput(
            'Do you want to attack again [default: yes] (yes/no)',
        );
        var actionCompleted: boolean = answer === 'no';
        while (!actionCompleted) {
            var toPosition = await this._prompForPosition('To position');

            try {
                gs.attemptAttack(
                    PieceType.BERSERKER,
                    fromPosition,
                    toPosition,
                    true,
                );
                actionCompleted = true;
            } catch (error: any) {
                if (error instanceof GameError) console.log(error.message);
            }
        }
    }

    private static async _handleAttack(gs: GameState) {
        var actionCompleted = false;
        while (!actionCompleted) {
            var pieceType = await this._promptForPiece(
                gs,
                'attack with a piece of the same kind',
            );
            var fromPosition = await this._prompForPosition('From position');
            var toPosition = await this._prompForPosition('To position');

            try {
                gs.attemptAttack(pieceType, fromPosition, toPosition);
                actionCompleted = true;
                if (pieceType === PieceType.SWORDSMAN)
                    await this._handleSwordsmanFreeMove(gs, fromPosition);
                if (pieceType === PieceType.BERSERKER)
                    await this._handleBerserkerSecondAttack(gs, fromPosition);
            } catch (error: any) {
                console.log(error.message);
            }
        }
    }

    private static async _handlePlace(gs: GameState) {
        var actionCompleted = false;
        while (!actionCompleted) {
            var pieceType = await this._promptForPiece(
                gs,
                'place from your hand',
                false,
            );
            var toPosition = await this._prompForPosition('To position');

            try {
                gs.attemptPlace(pieceType, toPosition);
                actionCompleted = true;
            } catch (error: any) {
                if (error instanceof GameError) console.log(error.message);
            }
        }
    }

    private static async _handleControl(gs: GameState) {
        var actionCompleted = false;
        while (!actionCompleted) {
            var pieceType = await this._promptForPiece(
                gs,
                'take control of a Control Zone',
            );
            var position = await this._prompForPosition(
                'Control Zone position',
            );
            try {
                gs.attemptGainControl(pieceType, position);
                actionCompleted = true;
            } catch (error: any) {
                console.log(error.message);
            }
        }
    }

    private static async _handleInitiative(gs: GameState) {
        var actionCompleted = false;
        while (!actionCompleted) {
            var pieceType = await this._promptForPiece(
                gs,
                'take the inititative',
            );
            try {
                gs.attemptTakeInitiative(pieceType);
                actionCompleted = true;
            } catch (error: any) {
                console.log(error.message);
            }
        }
    }

    private static async _handleOrReturn(
        gs: GameState,
        check: () => boolean,
        handler: (gs: GameState) => Promise<void>,
        errorMessage: string,
    ) {
        if (check()) await handler(gs);
        else console.log(errorMessage);
    }

    public static async handle(action: string, gs: GameState) {
        switch (action) {
            case 'move':
                if (gs.canMove()) await this._handleMove(gs);
                else console.log("You don't have any piece to move");
                break;
            case 'recruit':
                if (gs.canRecruit()) await this._handleRecruit(gs);
                else console.log("You don't have any piece to recruit");
                break;
            case 'place':
                if (gs.canPlacePiece()) await this._handlePlace(gs);
                else console.log("You can't place any piece");
                break;
            case 'attack':
                if (gs.canAttack()) await this._handleAttack(gs);
                else console.log("You don't have any possible attacks");
                break;
            case 'control':
                if (gs.canControlAZone()) await this._handleControl(gs);
                else console.log("You don't have any zone to control");
                break;
            case 'initiative':
                if (gs.canTakeInitiative()) await this._handleInitiative(gs);
                else console.log('You already have the initiative');
                break;
            case 'forfeit':
                gs.forfeit();
                break;
        }
    }
}
