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
            this.playlist.items.forEach((game,index)=>{
                [...new Set(
                    game.label.toLowerCase().match(/[a-z0-9]+/g).map((token)=>token.split("").map((c,i)=>token.slice(i)).map((rw)=>rw.split("").map((c2,i2)=>rw.slice(0,i2+1)))).flat(2))
                ].forEach(rl=>this.nameIndex[rl]?this.nameIndex[rl].push({index: index,game: game}):this.nameIndex[rl]=[{index: index,game: game}]);
                this.crcIndex[game.crc32] = game;
                this.pathIndex[game.path] = game;
            });
        }
    }

    filter(type, filter) {
        const tokens = filter.toLowerCase().match(/[a-z0-9]+/g)||[];
        if (this.playlist && this.playlist.items) {
            switch(type){
                case "label":
                    if (tokens.length>0) {
                        this.filteredItems = [];
                        tokens.forEach(token=>{
                            if (this.nameIndex[token]) {
                                if (this.filteredItems.length>0) {
                                    this.filteredItems = this.filteredItems.filter(w=>{return this.nameIndex[token].filter(i=>(w.index===i.index)).length>0;});
                                }
                                else {
                                    this.filteredItems = [ ...this.nameIndex[token] ];
                                }
                            }
                        });
                        this.filteredItems = this.filteredItems.map(wrapped=>wrapped.index);
                        this.filteredItems = [...new Set(this.filteredItems)];
                        this.filteredItems = this.filteredItems.map(index=>({game:this.playlist.items[index], index: index}))
                    }
                    else {
                        this.filteredItems = this.playlist.items.map((game,index)=>({index: index, game: game}));
                    }
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
        //this.filteredItems = [...this.playlist.items];
        this.index();
        this.filter("label","");
        this.publish();
    }
    
    add(game) {
        this.playlist = JSON.parse(JSON.stringify(this.playlist));
        this.playlist.items.push({...game});
        this.index();
        this.filter("label","");
        this.publish();
    }

    delete(index) {
        this.playlist = JSON.parse(JSON.stringify(this.playlist));
        this.playlist.items.splice(index,1);
        this.index();
        this.filter("label","");
        this.publish();
    }

}
