import { Piece, PieceFactory, PieceType } from '../models/piece';
import { Player } from '../models/player';
import { Position } from '../models/position';
import { GameError, GameErrorCause } from './GameError';

interface ControlledPiece {
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

    public crowForfeit: boolean = false;
    public wolfForfeit: boolean = false;

    private _activePlayer: Player;

    public get activePlayer(): Player {
        return this._activePlayer;
    }

    private _hasTheInitiative: Player;

    private _turnEnd: boolean = false;

    public get turnEnd(): boolean {
        return this._turnEnd;
    }

    private _piecesInPlay: ControlledPiece[];

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

        this._activePlayer = this._crow;
        this._piecesInPlay = Array<ControlledPiece>();
        const startingControlZones = [
            [1, 'a', this._crow],
            [2, 'b', null],
            [1, 'c', null],
            [3, 'c', null],
            [2, 'd', null],
            [3, 'e', this._wolf],
        ];
        this._controlZones = startingControlZones.map((zone) => {
            return {
                position: Position.from(zone[0] as number, zone[1] as string),
                controller: zone[2] as Player | null,
            };
        });
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

    public atPosition(position: Position): Square {
        return this.at(position.row, position.col);
    }

    private _getControlZoneString(controlZone: ControlZone | null): string {
        if (controlZone === null) return ' . ';
        else
            return this.switchByPlayer<string>(
                controlZone.controller,
                () => ' W ',
                () => ' C ',
                () => ' @ ',
            );
    }

    private _getRowString(row: number): string {
        //Row letter
        var result = `${String.fromCharCode('a'.charCodeAt(0) + row)}| `;
        for (var col = 0; col < 5; ++col) {
            // Squares
            const { controlledPiece: piece, controlZone } = this.at(row, col);
            if (piece === null) {
                debugger;
                result += this._getControlZoneString(controlZone);
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
            `Discard pile: ${this._activePlayer.discardString}`,
        ];
    }

    public toString(): string {
        var result: string[] = [];
        result.push('   ');
        // Column Numbers
        for (var i = 0; i < 5; ++i) result[0] += ` ${i} `;
        result.push(`   ${'___'.repeat(5)}`);

        // Board
        for (var row = 0; row < 5; ++row) result.push(this._getRowString(row));

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
                this.checkPlayerLose(this.crow) ||
                this.crowForfeit,
            () =>
                this.checkPlayerControlsFourZones(this.crow) ||
                this.checkPlayerLose(this.wolf) ||
                this.wolfForfeit,
            () => false,
        );
    }

    public getWinner(): string | null {
        if (this.checkWin(this.crow)) return 'Crow';
        if (this.checkWin(this.wolf)) return 'Wolf';
        return null;
    }

    public attemptGainControl(
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

        if (piece === null || piece.controller !== this._activePlayer)
            throw GameError.withCause(GameErrorCause.NoPieceToControlWith);

        if (!this._activePlayer.hasPieceInHand(discardedPieceType))
            throw GameError.withCause(GameErrorCause.NoPieceToDiscard);

        this._activePlayer.discard(discardedPieceType);
        this._controlZones[controlZoneIdx].controller = this._activePlayer;
    }

    public attemptMove(
        discardedPieceType: PieceType,
        initialPosition: Position,
        targetPosition: Position,
        isFreeMove: boolean = false,
    ) {
        const initialSquare = this.atPosition(initialPosition);
        const targetSquare = this.atPosition(targetPosition);

        if (initialSquare.controlledPiece === null)
            throw GameError.withCause(GameErrorCause.NoPieceToMove);

        if (targetSquare.controlledPiece !== null)
            throw GameError.withCause(GameErrorCause.OcuppiedTargetSquare);

        if (initialSquare.controlledPiece.controller !== this._activePlayer)
            throw GameError.withCause(GameErrorCause.InactivePlayerMove);

        if (!initialSquare.controlledPiece.piece.canMoveTo(targetPosition))
            throw GameError.withCause(GameErrorCause.InvalidMove);

        if (
            discardedPieceType != PieceType.ROYAL &&
            initialSquare.controlledPiece.piece.type !== discardedPieceType
        )
            throw GameError.withCause(GameErrorCause.UnmatchingPieces);

        if (!isFreeMove) {
            if (!this._activePlayer.hasPieceInHand(discardedPieceType))
                throw GameError.withCause(GameErrorCause.NoPieceToDiscard);
            this._activePlayer.discard(discardedPieceType);
        }

        this._piecesInPlay
            .find((piece) => piece == initialSquare.controlledPiece)!
            .piece.moveTo(targetPosition);
    }

    public attemptTakeInitiative(discardedPieceType: PieceType) {
        if (!this._activePlayer.hasPieceInHand(discardedPieceType))
            throw GameError.withCause(GameErrorCause.NoPieceToDiscard);
        this._activePlayer.discard(discardedPieceType);
        this._hasTheInitiative = this._activePlayer;
    }

    public attemptRecruit(
        recruitedPieceType: PieceType,
        usingRoyal: boolean = false,
    ) {
        if (usingRoyal && !this._activePlayer.hasPieceInHand(PieceType.ROYAL))
            throw GameError.withCause(GameErrorCause.NoPieceToDiscard);
        if (
            !usingRoyal &&
            !this._activePlayer.hasPieceInHand(recruitedPieceType)
        )
            throw GameError.withCause(GameErrorCause.NoPieceToDiscard);
        try {
            this._activePlayer.recruit(recruitedPieceType);
        } catch {
            throw GameError.withCause(GameErrorCause.NoPieceToRecruit);
        }
        this._activePlayer.discard(
            usingRoyal ? PieceType.ROYAL : recruitedPieceType,
        );
    }

    private _getPositionsToPlace(): Position[] {
        return this._controlZones.flatMap((controlZone) =>
            controlZone.controller === this._activePlayer
                ? controlZone.position.getOrthogonallyAdjacent()
                : [],
        );
    }

    public attemptPlace(pieceType: PieceType, targetPosition: Position) {
        const targetSquare = this.atPosition(targetPosition);

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

    public attemptAttack(
        discardedPieceType: PieceType,
        initialPosition: Position,
        targetPosition: Position,
        isFreeAttack: boolean = false,
    ) {
        const initialSquare = this.atPosition(initialPosition);
        const targetSquare = this.atPosition(targetPosition);

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

        if (
            discardedPieceType != PieceType.ROYAL &&
            initialSquare.controlledPiece.piece.type !== discardedPieceType
        )
            throw GameError.withCause(GameErrorCause.UnmatchingPieces);

        if (!isFreeAttack) {
            if (!this._activePlayer.hasPieceInHand(discardedPieceType))
                throw GameError.withCause(GameErrorCause.NoPieceToDiscard);

            this._activePlayer.discard(discardedPieceType);
        }
        this._piecesInPlay.splice(
            this._piecesInPlay.findIndex(
                (piece) => piece == targetSquare.controlledPiece,
            ),
            1,
        );
    }

    public forfeit() {
        this.switchByPlayer<void>(
            this._activePlayer,
            () => {
                this.wolfForfeit = true;
            },
            () => {
                this.crowForfeit = true;
            },
            () => {
                return;
            },
        );
    }

    public canControlAZone(): boolean {
        return this._controlZones.some(({ position }) => {
            const piece = this.atPosition(position).controlledPiece;
            return piece !== null && piece.controller === this._activePlayer;
        });
    }

    public canPlacePiece(): boolean {
        return this._getPositionsToPlace().some(
            (position) => this.atPosition(position).controlledPiece === null,
        );
    }

    public canRecruit(): boolean {
        return !this._activePlayer.recruitmentIsEmpty;
    }

    public canMove(): boolean {
        return this._piecesInPlay
            .filter(({ controller }) => controller === this._activePlayer)
            .flatMap(({ piece }) => piece.getMoves())
            .some(
                (position) =>
                    this.atPosition(position).controlledPiece === null,
            );
    }

    public canAttack(): boolean {
        return this._piecesInPlay
            .filter(({ controller }) => controller === this._activePlayer)
            .flatMap(({ piece }) => piece.getAttackedSquares())
            .some(
                (position) =>
                    this.atPosition(position).controlledPiece !== null &&
                    this.atPosition(position).controlledPiece!.controller !==
                        this._activePlayer,
            );
    }

    public canTakeInitiative(): boolean {
        return this._activePlayer !== this._hasTheInitiative;
    }
}
