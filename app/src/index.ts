import { GameState } from './gamestate/GameState';
import { ActionHandler } from './ActionHandler';
import { waitInput } from './waitInput';
import { Client } from 'ts-postgres';

async function getAction(): Promise<string> {
    var action = '';
    var answer = '';
    while (action === '') {
        answer = await waitInput(
            `Make an action (${ActionHandler.validActions.join('/')}): `,
        );
        if (ActionHandler.validActions.includes(answer)) action = answer;
        else console.log('Invalid action.');
    }

    return action;
}

async function turnLoop(gs: GameState): Promise<void> {
    console.clear();
    console.log(`${gs}`, '\n');

    while (!gs.activePlayer.handIsEmpty && gs.getWinner() === null) {
        console.log(`Hand: ${gs.activePlayer.handString}`);
        const action = await getAction();
        await ActionHandler.handle(action, gs);
    }
}

async function main() {
    const gs: GameState = new GameState();

    const client = new Client({
        host: 'db',
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
    });

    await client.connect();
    console.clear();
    try {
        const result = client.query(
            'SELECT name, wins, last_seen FROM Users ORDER BY last_seen DESC',
        );
        console.log;
        for await (const row of result) {
            console.log(
                `Name: ${row.get('name')}  Wins: ${row.get(
                    'wins',
                )}  Last Seen: ${row.get('last_seen')}`,
            );
        }
    } catch (error: any) {
        console.error(error);
    } finally {
        await client.end();
        console.log('\n\n');
    }

    console.log('Welcome to Warchest-Lite');
    console.log(
        'DISCLAIMER: SOME ACTIONS MAY LEAD TO A SOFTBLOCK OF THE GAME',
        'IN SUCH CASE, PRESS CTRL-C TO EXIT ',
    );
    await waitInput('Press enter to continue');

    while (gs.getWinner() === null) {
        if (gs.activePlayer.bagIsEmpty) gs.activePlayer.refill();
        gs.activePlayer.drawHand();
        await turnLoop(gs);
        gs.swapActivePlayer();
    }

    console.log('The game has ended!', `The winner is: ${gs.getWinner()}`);
}
main();
