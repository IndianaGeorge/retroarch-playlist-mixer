import { StateEvents } from 'react-state-events'
import FileSaver from 'file-saver';

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

    exportPlaylist() {
        if (this.playlist) {
            const text = JSON.stringify(this.playlist,null,2);
            var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, this.filename);    
        }
    }
      
    tokenize(text) {
        return [...new Set(text.toLowerCase().match(/[a-z0-9]+/g).map((token)=>token.split("").map((c,i)=>token.slice(i)).map((rw)=>rw.split("").map((c2,i2)=>rw.slice(0,i2+1)))).flat(2))];
    }

    storeInRefs(index,tokens,wrap) {
        tokens.forEach(rl=>index.hasOwnProperty(rl)?index[rl].push(wrap.index):index[rl]=[wrap.index])
    }

    indexSingle(wrap) {
        if (wrap.game.label) {
            this.storeInRefs(this.nameIndex,this.tokenize(wrap.game.label),wrap);
            if (this.fullLabel[wrap.game.label]) {
                this.fullLabel[wrap.game.label].push(wrap);
            }
            else {
                this.fullLabel[wrap.game.label] = [wrap];
            }
        }
        if (wrap.game.crc32) {
            const crc = wrap.game.crc32.toLowerCase().match(/^[a-z0-9]+/);
            if (crc.length>0) {
                this.storeInRefs(this.crcIndex,this.tokenize(crc[0]),wrap);
            }
            if (this.fullCrc[wrap.game.crc32]) {
                this.fullCrc[wrap.game.crc32].push(wrap);
            }
            else {
                this.fullCrc[wrap.game.crc32] = [wrap];
            }

        }
        if (wrap.game.path && wrap.game.path.length>0) {
            this.storeInRefs(this.pathIndex,this.tokenize(wrap.game.path),wrap);
            if (this.fullPath[wrap.game.path]) {
                this.fullPath[wrap.game.path].push(wrap);
            }
            else {
                this.fullPath[wrap.game.path] = [wrap];
            }

            const filename = wrap.game.path.match(/([^\\#]+)$/)[1];
            this.storeInRefs(this.filenameIndex,this.tokenize(filename),wrap);
            if (this.fullFilename[filename]) {
                this.fullFilename[filename].push(wrap);
            }
            else {
                this.fullFilename[filename] = [wrap];
            }

        }
    }

    index() {
        if (this.playlist && this.playlist.items) {
            this.clearIndexes();
            this.allItems = this.playlist.items.map((game,index)=>({index: index, game: game}));
            this.allItems.forEach(wrap=>this.indexSingle(wrap));
        }
    }

    clearIndexes() {
        this.nameIndex = {};
        this.crcIndex = {};
        this.pathIndex = {};
        this.filenameIndex = {};
        this.allItems = [];
        this.fullLabel = {};
        this.fullCrc = {};
        this.fullPath = {};
        this.fullFilename = {};
    }

    applyFilter(index,tokens) {
        this.filteredItems = [];
        tokens.forEach(token=>{
            if (index[token]) {
                if (this.filteredItems.length>0) {
                    this.filteredItems = this.filteredItems.filter(w=>{return index[token].filter(i=>(w===i)).length>0;});
                }
                else {
                    this.filteredItems = [ ...index[token] ];
                }
            }
        });
        this.filteredItems = [...new Set(this.filteredItems)];
        this.filteredItems = this.filteredItems.map(index=>(this.allItems[index]));
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
                this.filteredItems = [...this.allItems];
            }
            this.filteredItemsEvents.publish(this.filteredItems);
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
        this.clearIndexes();
        this.publish();
    }

    set(playlist,filename) {
        this.filename = filename;
        this.playlist = JSON.parse(JSON.stringify(playlist));
        this.index();
        this.filter("label","");
        this.publish();
    }
    
    add(game) {
        this.playlist = JSON.parse(JSON.stringify(this.playlist));
        const gameCopy = {...game};
        const wrap = {index: this.playlist.items.length, game: gameCopy};
        this.allItems.push(wrap);
        this.playlist.items.push(gameCopy);
        this.indexSingle(wrap);
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
