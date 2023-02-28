export class PieceType {
    static readonly ARCHER = new PieceType('A', 'Archer');
    static readonly BERSERKER = new PieceType('B', 'Berserker');
    static readonly MERCENARY = new PieceType('M', 'Mercenary');
    static readonly SWORDSMAN = new PieceType('S', 'Swordsman');

    public readonly short: string;
    public readonly long: string;

    private constructor(short: string, long: string) {
        this.short = short;
        this.long = long;
    }
}
