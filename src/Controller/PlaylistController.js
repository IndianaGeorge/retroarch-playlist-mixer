import { StateEvents } from 'react-state-events'

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
        this.filteredItems = null;
        this.filename = null;
        this.nameIndex = {};
        this.crcIndex = {};
        this.pathIndex = {};
        this.playlistEvents = new StateEvents();
        this.filteredItemsEvents = new StateEvents();
        this.filenameEvents = new StateEvents();
    }

    getPlaylistEvents() {
        return this.playlistEvents;
    }

    getfilteredItemsEvents() {
        return this.filteredItemsEvents;
    }

    getFilenameEvents() {
        return this.filenameEvents;
    }

    getEmptyPlaylist() {
        return JSON.parse(JSON.stringify(emptyPlaylist));
    }

    index() {
        if (this.playlist && this.playlist.items) {
            this.nameIndex = {};
            this.crcIndex = {};
            this.pathIndex = {};
            this.playlist.items.forEach(game=>{
                this.nameIndex[game.label] = game;
                this.crcIndex[game.crc32] = game;
                this.pathIndex[game.path] = game;
            });
        }
    }

    filter(type, filter) {
        if (this.playlist && this.playlist.items) {
            switch(type){
                case "label":
                    this.filteredItems = this.playlist.items.filter(game=>game.label.indexOf(filter)>-1);
                    this.filteredItemsEvents.publish([...this.filteredItems]);
                    break;
                case "crc32":
                    this.filteredItems = this.playlist.items.filter(game=>game.crc32.indexOf(filter)>-1);
                    this.filteredItemsEvents.publish(this.filteredItems);
                    break;
                case "path":
                    this.filteredItems = this.playlist.items.filter(game=>game.path.indexOf(filter)>-1);
                    this.filteredItemsEvents.publish(this.filteredItems);
                    break;
                default:
                    break;
            }
        }
    }

    publish() {
        this.filenameEvents.publish(this.filename);
        this.playlistEvents.publish(this.playlist);
        this.filteredItemsEvents.publish(this.filteredItems);
    }

    empty() {
        this.playlist = null;
        this.filteredItems = null;
        this.filename = null;
        this.publish();
    }

    set(playlist,filename) {
        this.filename = filename;
        this.playlist = JSON.parse(JSON.stringify(playlist));
        this.filteredItems = [...this.playlist.items];
//        this.index();
        this.publish();
    }
    
    add(game) {
        this.playlist = JSON.parse(JSON.stringify(this.playlist));
        this.playlist.items.push({...game});
        this.publish();
    }

    delete(index) {
        this.playlist = JSON.parse(JSON.stringify(this.playlist));
        this.playlist.items.splice(index,1);
        this.publish();
    }

}
