export interface PieceType {
    short: string;
    long: string;
}

export const PieceTypes = {
    ARCHER: { short: 'A', long: 'Archer' },
    BERSERKER: { short: 'B', long: 'Berserker' },
    MERCENARY: { short: 'M', long: 'Mercenary' },
    SWORDSMAN: { short: 'S', long: 'Swordsman' },
} as const;
