import { App } from "../App";
import { EventTypeInfo } from "../EventTypeInfo";
import { StringRepresentations } from "../StringRepresentations";
import { General } from "./General";

export class EventController {
    private observerMap : Map<object, Set<Function>> = new Map();
    private callbackMap : Map<object, Function> = new Map();
    private identity;

    constructor(identity) {
        this.identity = identity;
    }

    public addObserver(eventType, observer: Function) {
        this.getSetOfObservers(eventType).add(observer);
    }

    public removeObserver(eventType, observer : Function) {
        this.getSetOfObservers(eventType).delete(observer);
    }

    public on(eventType, callback : Function) {
        this.callbackMap.set(eventType, callback);
    }

    public triggerEvent(eventType, eventObject) {
        if (App.log) {
            console.log("triggerEvent " + EventTypeInfo.nameOfEventType.get(eventType) 
                + " at " + StringRepresentations.getStringRepresentation(this.identity));
        }
        this.getSetOfObservers(eventType).forEach(function(observer) {
            observer(eventObject);
        });
        if (this.callbackMap.has(eventType)) {
            this.callbackMap.get(eventType)();
        }
    }

    public getNumberOfObservers(eventType) : number {
        return this.getSetOfObservers(eventType).size;
    }

    private getSetOfObservers(eventType) {
        return this.getSetOfObserver_eventTypeSafe(General.ensurePrimitiveTypeIfString(eventType));
    }

    private getSetOfObserver_eventTypeSafe(eventTypeSafe) {
        if (!this.observerMap.has(eventTypeSafe)) {
            this.observerMap.set(eventTypeSafe, new Set<Function>());
        }
        return this.observerMap.get(eventTypeSafe);
    }
}