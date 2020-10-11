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

    tokenize(text) {
        return [...new Set(text.toLowerCase().match(/[a-z0-9]+/g).map((token)=>token.split("").map((c,i)=>token.slice(i)).map((rw)=>rw.split("").map((c2,i2)=>rw.slice(0,i2+1)))).flat(2))];
    }

    storeInRefs(index,tokens,game,position) {
        tokens.forEach(rl=>index[rl]?index[rl].push({index: position,game: game}):index[rl]=[{index: position,game: game}])
    }

    index() {
        if (this.playlist && this.playlist.items) {
            this.nameIndex = {};
            this.crcIndex = {};
            this.pathIndex = {};
            this.filenameIndex = {};
            this.playlist.items.forEach((game,index)=>{
                if (game.label) {
                    this.storeInRefs(this.nameIndex,this.tokenize(game.label),game,index);
                }
                if (game.crc32) {
                    const crc = game.crc32.toLowerCase().match(/^[a-z0-9]+/);
                    if (crc.length>0) {
                        this.storeInRefs(this.crcIndex,this.tokenize(crc[0]),game,index);
                    }
                }
                if (game.path && game.path.length>0) {
                    this.storeInRefs(this.pathIndex,this.tokenize(game.path),game,index);
                    this.storeInRefs(this.filenameIndex,this.tokenize(game.path.match(/([^\\#]+)\....$/)[1]),game,index);
                }
            });
        }
    }

    applyFilter(index,tokens) {
        this.filteredItems = [];
        tokens.forEach(token=>{
            if (index[token]) {
                if (this.filteredItems.length>0) {
                    this.filteredItems = this.filteredItems.filter(w=>{return index[token].filter(i=>(w.index===i.index)).length>0;});
                }
                else {
                    this.filteredItems = [ ...index[token] ];
                }
            }
        });
        this.filteredItems = this.filteredItems.map(wrapped=>wrapped.index);
        this.filteredItems = [...new Set(this.filteredItems)];
        this.filteredItems = this.filteredItems.map(index=>({game:this.playlist.items[index], index: index}));
    }

    filter(type, filter) {
        const tokens = filter.toLowerCase().match(/[a-z0-9]+/g)||[];
        if (this.playlist && this.playlist.items) {
            if (tokens.length>0) {
                switch(type) {
                    case "label":
                        this.applyFilter(this.nameIndex,tokens);
                        break;
                    case "crc32":
                        this.applyFilter(this.crcIndex,tokens);
                        break;
                    case "path":
                        this.applyFilter(this.pathIndex,tokens);
                        break;
                    case "filename":
                        this.applyFilter(this.filenameIndex,tokens);
                        break;
                    default:
                        break;
                }
            }
            else {
                this.filteredItems = this.playlist.items.map((game,index)=>({index: index, game: game}));
            }
            this.filteredItemsEvents.publish([...this.filteredItems]);
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
