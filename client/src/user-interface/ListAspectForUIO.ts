// import {ObservableList} from "@/core/ObservableList";
// import type {SemsObject} from "@/core/SemsObject";
// import {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
// import type {UserInterface} from "@/user-interface/UserInterface";
//
// export class ListAspectForUIO {
//
//     private listOfUIOs : ObservableList<UserInterfaceObject>;
//
//     constructor(private userInterface : UserInterface, private listOfSemsObjects : ObservableList<SemsObject>) {
//         this.createListOfUIOs();
//     }
//
//     getListOfUIOs() : ObservableList<UserInterfaceObject>{
//         return this.listOfUIOs;
//     }
//
//     private createListOfUIOs() {
//         this.listOfUIOs = new ObservableList<UserInterfaceObject>();
//         this.updateListOfUIOs();
//         this.listOfSemsObjects.subject.subscribe(next => {
//             this.updateListOfUIOs();
//         });
//         return this.listOfUIOs;
//     }
//
//     private updateListOfUIOs() {
//         this.listOfUIOs.clear();
//         this.listOfSemsObjects.createCopyOfList().forEach(object => {
//             let uio = new UserInterfaceObject(this.userInterface);
//             uio.setSemsObject(object);
//             this.listOfUIOs.add(uio);
//         });
//     }
//
//     isEmpty() {
//         return this.listOfUIOs.isEmpty();
//     }
//
//     length() {
//         return this.listOfUIOs.length();
//     }
//
//     get(index: number) : UserInterfaceObject {
//         return this.listOfUIOs.createCopyOfList()[index];
//     }
// }