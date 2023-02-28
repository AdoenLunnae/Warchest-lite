import { Piece, PieceType, PieceFactory } from '../piece';
import { Player } from './Player';

describe('Player', () => {
    it('creates with the specified piece types', () => {
        const player = Player.withPieceTypes([
            PieceType.ARCHER,
            PieceType.MERCENARY,
        ]);

        expect(player).toBeInstanceOf(Player);
        expect(player['_hand'].length).toBe(0);
        expect(player['_bag'].length).toBe(4);
        expect(player['_recruitment']).toEqual(
            expect.arrayContaining([
                {
                    type: PieceType.ARCHER,
                    availableQuantity: 2,
                },
                {
                    type: PieceType.MERCENARY,
                    availableQuantity: 3,
                },
            ]),
        );
    });
    it('can draw a hand from the bag', () => {
        const player = Player.withPieceTypes([
            PieceType.ARCHER,
            PieceType.MERCENARY,
        ]);
        player.drawHand();
        expect(player['_hand'].length).toBe(3);
        expect(player['_bag'].length).toBe(1);
    });

    it('can recruit pieces into the bag', () => {
        const player = Player.withPieceTypes([
            PieceType.ARCHER,
            PieceType.MERCENARY,
        ]);
        player.recruit(PieceType.ARCHER);

        expect(player['_bag'].length).toBe(5);
        expect(player['_recruitment']).toEqual(
            expect.arrayContaining([
                {
                    type: PieceType.ARCHER,
                    availableQuantity: 1,
                },
                {
                    type: PieceType.MERCENARY,
                    availableQuantity: 3,
                },
            ]),
        );
    });

    it('can discard pieces from hand', () => {
        const player = Player.withPieceTypes([
            PieceType.ARCHER,
            PieceType.MERCENARY,
        ]);
        player['_hand'].push(PieceFactory.pieceOfType(PieceType.ARCHER));

        player.discard(PieceType.ARCHER);

        expect(player['_hand'].length).toBe(0);
        expect(player['_discard']).toEqual(
            expect.arrayContaining([
                PieceFactory.pieceOfType(PieceType.ARCHER),
            ]),
        );
    });

    it('can refill bag from discard', () => {
        const player = Player.withPieceTypes([
            PieceType.ARCHER,
            PieceType.MERCENARY,
        ]);
        player['_bag'].splice(0, 4);
        const pieces: Piece[] = [
            PieceFactory.pieceOfType(PieceType.ARCHER),
            PieceFactory.pieceOfType(PieceType.BERSERKER),
            PieceFactory.pieceOfType(PieceType.ARCHER),
        ];

        player['_discard'] = [...pieces];

        player.refill();

        expect(player['_discard'].length).toBe(0);
        expect(player['_bag'].length).toBe(pieces.length);
        expect(player['_bag']).toEqual(expect.arrayContaining(pieces));
    });
});
