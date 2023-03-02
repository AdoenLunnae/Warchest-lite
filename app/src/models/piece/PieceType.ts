export class PieceType {
    static readonly ARCHER = new PieceType('A', 'Archer');
    static readonly BERSERKER = new PieceType('B', 'Berserker');
    static readonly MERCENARY = new PieceType('M', 'Mercenary');
    static readonly SWORDSMAN = new PieceType('S', 'Swordsman');
    static readonly ROYAL = new PieceType('R', 'Royal');

    static readonly types = [
        this.ARCHER,
        this.BERSERKER,
        this.MERCENARY,
        this.SWORDSMAN,
        this.ROYAL,
    ];
    public readonly short: string;
    public readonly long: string;

    private constructor(short: string, long: string) {
        this.short = short;
        this.long = long;
    }

    public static fromString(value: string): PieceType | undefined {
        return this.types.find((type) => type.long === value);
    }

    public static isValidType(value: string) {
        return this.types.some((type) => {
            type.long === value;
        });
    }
}
