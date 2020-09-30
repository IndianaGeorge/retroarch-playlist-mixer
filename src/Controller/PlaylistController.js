import {StateEvents} from 'react-state-events'

const emptyPlaylist = {
    version: "1.2",
    default_core_path: "",
    default_core_name: "",
    label_display_mode: 0,
    right_thumbnail_mode: 0,
    left_thumbnail_mode: 0,
    items: []
}

export default class PlaylistController {
    constructor() {
        this.playlist = null;
        this.filename = null;
        this.playlistEvents = new StateEvents();
        this.filenameEvents = new StateEvents();
    }

    getPlaylistEvents() {
        return this.playlistEvents;
    }

    getFilenameEvents() {
        return this.filenameEvents;
    }

    getEmptyPlaylist() {
        return JSON.parse(JSON.stringify(emptyPlaylist));
    }

    publish() {
        this.filenameEvents.publish(this.filename);
        this.playlistEvents.publish(this.playlist);
    }

    empty() {
        this.playlist = null;
        this.filename = null;
        this.publish();
    }

    set(playlist,filename) {
        this.filename = filename;
        this.playlist = JSON.parse(JSON.stringify(playlist));
        this.publish();
    }

}
