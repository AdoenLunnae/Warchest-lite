import { Piece, PieceFactory, PieceType } from '../models/piece';
import { Player } from '../models/player';
import { Position } from '../models/position';
import { GameError, GameErrorCause } from './GameError';

export interface ControlledPiece {
    piece: Piece;
    controller: Player;
}

interface ControlZone {
    position: Position;
    controller: Player | null;
}

interface Square {
    controlledPiece: ControlledPiece | null;
    controlZone: ControlZone | null;
}

export class GameState {
    private _crow: Player;
    public get crow(): Player {
        return this._crow;
    }

    private _wolf: Player;
    public get wolf(): Player {
        return this._wolf;
    }

    private _activePlayer: Player;
    public get activePlayer(): Player {
        return this._activePlayer;
    }

    private _hasTheInitiative: Player;
    public get hasTheInitiative(): Player {
        return this._hasTheInitiative;
    }

    private _turnEnd: boolean;
    public get turnEnd(): boolean {
        return this._turnEnd;
    }
    private _piecesInPlay: ControlledPiece[];
    public get piecesInPlay(): ControlledPiece[] {
        return this._piecesInPlay;
    }
    public set piecesInPlay(value: ControlledPiece[]) {
        this._piecesInPlay = value;
    }
    private _controlZones: ControlZone[];

    private switchByPlayer<T>(
        player: Player | null,
        wolfCallback: () => T,
        crowCallback: () => T,
        defaultCallback: () => T,
    ): T {
        switch (player) {
            case this.wolf:
                return wolfCallback();
            case this.crow:
                return crowCallback();
            default:
                return defaultCallback();
        }
    }

    public swapActivePlayer() {
        if (this._activePlayer === this._crow) this._activePlayer = this._wolf;
        else this._activePlayer = this._crow;
    }

    public passTurn() {
        if (this._turnEnd) this._activePlayer = this._hasTheInitiative;
        else this.swapActivePlayer();
        this._turnEnd = !this._turnEnd;
    }

    public constructor() {
        const pieces = [
            PieceType.ARCHER,
            PieceType.BERSERKER,
            PieceType.MERCENARY,
            PieceType.SWORDSMAN,
        ];

        var index: number;
        var selectedPieces: PieceType[] = [];
        var leftPieces: PieceType[] = [...pieces];

        for (let i = 0; i < pieces.length / 2; ++i) {
            index = Math.floor(Math.random() * leftPieces.length);
            selectedPieces.push(leftPieces.splice(index, 1)[0]);
        }

        const crowPieces = [...selectedPieces];
        const wolfPieces = [...leftPieces];

        this._crow = Player.withPieceTypes(crowPieces);
        this._wolf = Player.withPieceTypes(wolfPieces);
        this._hasTheInitiative = this._crow;
        this._turnEnd = false;

        this._crow.drawHand();
        this._wolf.drawHand();

        this._activePlayer = this._crow;
        this._piecesInPlay = [];

        this._controlZones = [
            {
                position: Position.from(1, 'a'),
                controller: this._crow,
            },
            {
                position: Position.from(2, 'b'),
                controller: null,
            },
            {
                position: Position.from(1, 'c'),
                controller: null,
            },
            {
                position: Position.from(3, 'c'),
                controller: null,
            },
            {
                position: Position.from(2, 'd'),
                controller: null,
            },
            {
                position: Position.from(3, 'e'),
                controller: this._wolf,
            },
        ];
    }

    public at(row: number, col: number): Square {
        var pieceAt = this._piecesInPlay.find(
            ({ piece }) =>
                piece.position !== null &&
                piece.position.col == col &&
                piece.position.row == row,
        );
        var controlZoneAt = this._controlZones.find(
            ({ position }) => position.col == col && position.row == row,
        );
        return {
            controlledPiece: pieceAt || null,
            controlZone: controlZoneAt || null,
        };
    }

    private _getControlZoneRepr(controlZone: ControlZone | null): string {
        if (controlZone === null) return ' . ';
        else
            return this.switchByPlayer<string>(
                controlZone.controller,
                () => ' W ',
                () => ' C ',
                () => ' @ ',
            );
    }

    private _getRowRepr(row: number): string {
        //Row letter
        var result = `${String.fromCharCode('a'.charCodeAt(0) + row)}| `;
        for (var col = 0; col < 5; ++col) {
            // Squares
            const { controlledPiece: piece, controlZone } = this.at(row, col);
            if (piece === null) {
                debugger;
                result += this._getControlZoneRepr(controlZone);
            } else {
                result += ` ${piece.piece.type.short}${
                    piece.controller === this._crow ? '^' : 'v'
                }`;
            }
        }
        return result;
    }

    private get _turnIndicator(): string {
        const turnIndicator =
            this._activePlayer === this._crow ? ' CROW (^) ' : ' WOLF (v) ';
        return `${'='.repeat(4)}${turnIndicator}${'='.repeat(4)}`;
    }

    private get _activePlayerData(): string[] {
        return [
            `Hand: ${this._activePlayer.handString}`,
            `Recruitment pieces: ${this._activePlayer.recruitmentString}`,
            'Discard pile:',
            `${this._activePlayer.discardString}`,
        ];
    }

    public toString(): string {
        var result: string[] = [];
        result.push('   ');
        // Column Numbers
        for (var i = 0; i < 5; ++i) result[0] += ` ${i} `;
        result.push(`   ${'___'.repeat(5)}`);

        // Board
        for (var row = 0; row < 5; ++row) result.push(this._getRowRepr(row));

        //Player info
        result.push(this._turnIndicator);
        result = result.concat(this._activePlayerData);

        return result.join('\n');
    }

    private checkPlayerLose(player: Player): boolean {
        const playerControlsAnyUnits = this._piecesInPlay.some(
            ({ controller }) => controller === player,
        );

        return player.hasNoMoreUnits() && !playerControlsAnyUnits;
    }

    private checkPlayerControlsFourZones(player: Player): boolean {
        const playerControlledZones = this._controlZones.filter(
            ({ controller }) => controller === player,
        );

        return playerControlledZones.length >= 4;
    }

    public checkWin(player: Player): boolean {
        return this.switchByPlayer<boolean>(
            player,
            () =>
                this.checkPlayerControlsFourZones(this.wolf) ||
                this.checkPlayerLose(this.crow),
            () =>
                this.checkPlayerControlsFourZones(this.crow) ||
                this.checkPlayerLose(this.wolf),
            () => false,
        );
    }

    public getWinner(): string | null {
        if (this.checkWin(this.crow)) return 'Crow';
        if (this.checkWin(this.wolf)) return 'Wolf';
        return null;
    }

    public gainControlOfZone(
        discardedPieceType: PieceType,
        position: Position,
    ) {
        const controlZoneIdx = this._controlZones.findIndex(
            (zone) =>
                zone.position.row === position.row &&
                zone.position.col === position.col,
        );

        if (controlZoneIdx === -1)
            throw GameError.withCause(GameErrorCause.NoControlZone);
        const controlZone = this._controlZones[controlZoneIdx];
        const piece = this.at(
            controlZone.position.row,
            controlZone.position.col,
        ).controlledPiece;
        if (piece === null || piece.controller !== this.activePlayer)
            throw GameError.withCause(GameErrorCause.NoPieceToControlWith);
        if (piece!.piece.type !== discardedPieceType)
            throw GameError.withCause(GameErrorCause.UnmatchingPieces);

        this.activePlayer.discard(discardedPieceType);
        this._controlZones[controlZoneIdx].controller = this._activePlayer;
    }

    public attemptMove(
        discardedPieceType: PieceType,
        initialPosition: Position,
        targetPosition: Position,
    ) {
        const initialSquare = this.at(initialPosition.row, initialPosition.col);
        const targetSquare = this.at(targetPosition.row, targetPosition.col);

        if (initialSquare.controlledPiece === null)
            throw GameError.withCause(GameErrorCause.NoPieceToMove);

        if (targetSquare.controlledPiece !== null)
            throw GameError.withCause(GameErrorCause.OcuppiedTargetSquare);

        if (initialSquare.controlledPiece.controller !== this._activePlayer)
            throw GameError.withCause(GameErrorCause.InactivePlayerMove);

        if (!initialSquare.controlledPiece.piece.canMoveTo(targetPosition))
            throw GameError.withCause(GameErrorCause.InvalidMove);

        if (initialSquare.controlledPiece.piece.type !== discardedPieceType)
            throw GameError.withCause(GameErrorCause.UnmatchingPieces);

        this.activePlayer.discard(discardedPieceType);

        this._piecesInPlay
            .find((piece) => piece == initialSquare.controlledPiece)!
            .piece.moveTo(targetPosition);
    }

    private _getPositionsToPlace(): Position[] {
        return this._controlZones.flatMap((controlZone) =>
            controlZone.controller === this._activePlayer
                ? controlZone.position.getOrthogonallyAdjacent()
                : [],
        );
    }

    public attemptPlace(pieceType: PieceType, targetPosition: Position) {
        const targetSquare = this.at(targetPosition.row, targetPosition.col);

        if (targetSquare.controlledPiece !== null)
            throw GameError.withCause(GameErrorCause.OcuppiedTargetSquare);

        var availablePositions = this._getPositionsToPlace();
        if (
            !availablePositions.some(
                (position) =>
                    position.col === targetPosition.col &&
                    position.row === targetPosition.row,
            )
        )
            throw GameError.withCause(GameErrorCause.InvalidPlacement);

        if (!this._activePlayer.hasPieceInHand(pieceType))
            throw GameError.withCause(GameErrorCause.NoPieceToPlace);

        this._activePlayer.place(pieceType);
        this._piecesInPlay.push({
            piece: PieceFactory.pieceOfTypeAt(pieceType, targetPosition),
            controller: this._activePlayer,
        });
    }

    public attemptAttack(initialPosition: Position, targetPosition: Position) {
        const initialSquare = this.at(initialPosition.row, initialPosition.col);
        const targetSquare = this.at(targetPosition.row, targetPosition.col);

        if (initialSquare.controlledPiece === null)
            throw GameError.withCause(GameErrorCause.NoPieceToAttackWith);

        if (initialSquare.controlledPiece.controller !== this._activePlayer)
            throw GameError.withCause(GameErrorCause.InactivePlayerAttack);

        if (targetSquare.controlledPiece === null)
            throw GameError.withCause(GameErrorCause.NoAttackTarget);

        if (targetSquare.controlledPiece.controller === this._activePlayer)
            throw GameError.withCause(GameErrorCause.FriendlyFire);

        if (!initialSquare.controlledPiece.piece.canAttackTo(targetPosition))
            throw GameError.withCause(GameErrorCause.InvalidAttack);

        this._piecesInPlay.splice(
            this._piecesInPlay.findIndex(
                (piece) => piece == targetSquare.controlledPiece,
            ),
            1,
        );
    }
}
