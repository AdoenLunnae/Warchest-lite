# Warchest-lite

## Implementation of a simplified version of [War Chest](https://boardgamegeek.com/boardgame/249259/war-chest) as part of my application to Eventbrite

### How to use

The only requirements are to have `docker` and `docker compose` installed.

To run the app, from the root folder of the project, execute:

```
docker compose run --rm app; docker compose down
```

As one single line (the second command removes the database service when the app exits).
