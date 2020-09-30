import { StateEvents } from 'react-state-events'

export default class FilterController {
    filter="";
    constructor() {
        this.filterEvents = new StateEvents();
    }

    getEvents() {
        return this.filterEvents;
    }

    set(text) {
        this.filter = text;
        this.filterEvents.publish(this.filter);
    }
}