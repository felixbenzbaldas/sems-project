export class List {
    
    public static insertInListAtPosition(list, item, position: number) {
        list.splice(position, 0, item);
    }

    public static deleteInListAtPosition(list, position: number) {
        list.splice(position, 1);
    }

    public static isLastElement(list, element) {
        let index = list.indexOf(element);
        return index == list.length - 1;
    }

    public static getLastElement<T>(list : Array<T>) : T {
        return list[list.length - 1];
    }
}