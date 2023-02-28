import { Piece, PieceTypes, PieceFactory } from '../piece';
import { Player } from './Player';

describe('Player', () => {
    it('creates with the specified piece types', () => {
        const player = Player.withPieceTypes([
            PieceTypes.ARCHER,
            PieceTypes.MERCENARY,
        ]);

        expect(player).toBeInstanceOf(Player);
        expect(player['_hand'].length).toBe(0);
        expect(player['_bag'].length).toBe(4);
        expect(player['_recruitment']).toEqual(
            expect.arrayContaining([
                {
                    type: PieceTypes.ARCHER,
                    availableQuantity: 2,
                },
                {
                    type: PieceTypes.MERCENARY,
                    availableQuantity: 3,
                },
            ]),
        );
    });
    it('can draw a hand from the bag', () => {
        const player = Player.withPieceTypes([
            PieceTypes.ARCHER,
            PieceTypes.MERCENARY,
        ]);
        player.drawHand();
        expect(player['_hand'].length).toBe(3);
        expect(player['_bag'].length).toBe(1);
    });

    it('can recruit pieces into the bag', () => {
        const player = Player.withPieceTypes([
            PieceTypes.ARCHER,
            PieceTypes.MERCENARY,
        ]);
        player.recruit(PieceTypes.ARCHER);

        expect(player['_bag'].length).toBe(5);
        expect(player['_recruitment']).toEqual(
            expect.arrayContaining([
                {
                    type: PieceTypes.ARCHER,
                    availableQuantity: 1,
                },
                {
                    type: PieceTypes.MERCENARY,
                    availableQuantity: 3,
                },
            ]),
        );
    });

    it('can discard pieces from hand', () => {
        const player = Player.withPieceTypes([
            PieceTypes.ARCHER,
            PieceTypes.MERCENARY,
        ]);
        player['_hand'].push(PieceFactory.pieceOfType(PieceTypes.ARCHER));

        player.discard(PieceTypes.ARCHER);

        expect(player['_hand'].length).toBe(0);
        expect(player['_discard']).toEqual(
            expect.arrayContaining([
                PieceFactory.pieceOfType(PieceTypes.ARCHER),
            ]),
        );
    });

    it('can refill bag from discard', () => {
        const player = Player.withPieceTypes([
            PieceTypes.ARCHER,
            PieceTypes.MERCENARY,
        ]);
        player['_bag'].splice(0, 4);
        const pieces: Piece[] = [
            PieceFactory.pieceOfType(PieceTypes.ARCHER),
            PieceFactory.pieceOfType(PieceTypes.BERSERKER),
            PieceFactory.pieceOfType(PieceTypes.ARCHER),
        ];

        player['_discard'] = [...pieces];

        player.refill();

        expect(player['_discard'].length).toBe(0);
        expect(player['_bag'].length).toBe(pieces.length);
        expect(player['_bag']).toEqual(expect.arrayContaining(pieces));
    });
});
