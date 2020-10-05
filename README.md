# Retroarch Playlist Mixer
[Try it out!](https://indianageorge.github.io/retroarch-playlist-mixer/)

## What?

This is a playlist mixer for [Retroarch](https://www.retroarch.com/) playlists (version 1.2 only, json format).

It's designed for coping items from the left panel to the right panel, and to delete from the right panel with a single click.

There is also a filter field at the bottom, so you can quickly find the game you're looking for.

## Why?

Retroarch has a playlist editor, but it doesn't allow you to copy items between playlists. Scanning directories creates playlists and there's a favorite list, but sometimes you want to make multiple playlists, for example: favorites in genre, in platform, era or your personal criteria which is not in any databases.

I made this so I could pick and choose from the generated playlists into smaller, custom ones.

## How?

* This project uses [React](https://reactjs.org/)
* This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
* This project uses [react-state-events](https://www.npmjs.com/package/react-state-events) to lift state and coordinate data between components

## Future?

Things I would have liked to put in, but they didn't work out within the timeframe I had. Some I may get to, some look like too much work:
* Drag and drop for playlist entries: none of this made it in.
* Filter by crc, path, core name, core path: filter takes a type parameter, but only "label" is implemented and UI doesn't expose it.
* ~~Indexing for better, faster filtering: Indexes are created, but they are inadequate and left unused. I wanted case insensitivity, global matches and high performance.~~
* A better color scheme: I didn't spend time thinking this one out.
* Console: There's a textfield at the bottom which would tell you what is being done. This is because I had planned for more complex operations, as seen in the next items.
* Overwrite destination, matching on label/path/crc: allows you to fix existing entries.
* Use game core from game,playlist,DETECT: for cleaner core settings.
* Set all playlist's core/core path: for cleaner core settings.

I found you find this program useful.

## License

MIT © [IndianaGeorge](https://github.com/IndianaGeorge)
