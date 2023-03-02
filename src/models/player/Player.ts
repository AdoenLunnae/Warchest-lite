import { PieceFactory, Piece, PieceType } from '../piece';

interface RecruitablePiece {
    type: PieceType;
    availableQuantity: number;
}

export class Player {
    private _bag: Piece[] = [];
    private _hand: Piece[] = [];
    private _recruitment: RecruitablePiece[] = [];
    private _discard: Piece[] = [];

    private setUpBag(availablePieceTypes: PieceType[]): void {
        this._bag = [];
        availablePieceTypes.forEach((type) => {
            this._bag.push(PieceFactory.pieceOfType(type));
            this._bag.push(PieceFactory.pieceOfType(type));
        });
        this._bag.push(PieceFactory.pieceOfType(PieceType.ROYAL));
    }

    private setUpRecruitment(availablePieceTypes: PieceType[]) {
        this._recruitment = [];
        var count: number;
        availablePieceTypes.forEach((type) => {
            count = PieceFactory.pieceOfType(type).totalNumber - 2;
            this._recruitment.push({ type: type, availableQuantity: count });
        });
    }

    private constructor(availablePieceTypes: PieceType[]) {
        this.setUpBag(availablePieceTypes);
        this.setUpRecruitment(availablePieceTypes);
        this._discard = Array<Piece>();
        this._hand = Array<Piece>();
    }

    public static withPieceTypes(availablePieceTypes: PieceType[]): Player {
        return new this(availablePieceTypes);
    }

    private _getRandomFromBag(): Piece {
        const idx = Math.floor(Math.random() * this._bag.length);
        return this._bag.splice(idx, 1)[0];
    }

    public drawHand(): void {
        const numberDraws = Math.min(3, this._bag.length);
        for (let i = 0; i < numberDraws; i++) {
            this._hand.push(this._getRandomFromBag());
        }
    }

    public recruit(ofType: PieceType): void {
        const idx = this._recruitment.findIndex((item) => item.type == ofType);

        if (idx === -1 || this._recruitment[idx].availableQuantity < 1)
            throw new Error('No more pieces of this type to recruit');

        this._recruitment[idx].availableQuantity -= 1;
        this._bag.push(PieceFactory.pieceOfType(this._recruitment[idx].type));
    }

    public place(pieceType: PieceType) {
        this._hand.splice(
            this._hand.findIndex((piece) => piece.type === pieceType),
            1,
        );
    }

    public discard(ofType: PieceType): void {
        const idx = this._hand.findIndex((piece) => piece.type == ofType);

        if (idx === -1) throw new Error();

        this._discard.push(this._hand.splice(idx, 1)[0]);
    }

    public refill(): void {
        this._bag = this._discard.splice(0, this._discard.length);
    }

    public get handString(): string {
        return this._hand.map((piece) => piece.type.long).join(', ');
    }

    public get recruitmentString(): string {
        return this._recruitment
            .map((piece) => `${piece.type.long} = ${piece.availableQuantity}`)
            .join(', ');
    }

    public get discardString(): string {
        return this._discard.map((piece) => piece.type.long).join(', ');
    }

    public get handIsEmpty(): boolean {
        return this._hand.length == 0;
    }

    public get recruitmentIsEmpty(): boolean {
        return this._recruitment.every((item) => item.availableQuantity == 0);
    }

    public get bagIsEmpty(): boolean {
        return this._bag.length == 0;
    }

    public hasNoMoreUnits(): boolean {
        return this.handIsEmpty && this.bagIsEmpty && this.recruitmentIsEmpty;
    }

    public hasPieceInHand(pieceType: PieceType): boolean {
        return this._hand.some((piece) => piece.type === pieceType);
    }
}
