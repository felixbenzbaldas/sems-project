import { App } from "../App";
import { DetailsData } from "../data/DetailsData";
import { ObjectLoader } from "../data/ObjectLoader";
import { General } from "../general/General";
import { Html } from "../general/Html";
import { List } from "../general/List";
import { SemsServer } from "../SemsServer";
import { Column } from "./Column";
import { KeyMode } from "./KeyMode";

export class ColumnManager {
    public static uiElement : HTMLElement;
    public static columns : Array<Column> = [];
    public static semsAddress_localMode = "1-44451244";
    private static detailsData : DetailsData;


    public static adaptStyleForKeyMode(keyMode : KeyMode) {
        if (keyMode == KeyMode.INSERTION) {
            this.uiElement.style.boxShadow = "inset 0rem -1.5rem 2.5rem -0.7rem green";
        } else {
            this.uiElement.style.boxShadow = "none";
        }
    }

    public static init() {
        this.uiElement = document.createElement("div");
        this.uiElement.style.overflowX = "auto";
        this.uiElement.style.whiteSpace = "nowrap";
        this.adaptStyleForKeyMode(App.keyMode);
        if (App.LOCAL_MODE) {
            ObjectLoader.ensureLoaded(ColumnManager.semsAddress_localMode, function() {
                ColumnManager.detailsData = DetailsData.map.get(ColumnManager.semsAddress_localMode);
                ColumnManager.detailsData.ensureDetailsAreLoaded(function() {
                    if (ColumnManager.detailsData.getDetails().length == 0) {
                        ColumnManager.createColumnAtPosition(0, General.emptyFunction);
                    } else {
                        for (let i = 0; i < ColumnManager.detailsData.getDetails().length; i++) {
                            let column : Column = Column.create(ColumnManager.detailsData.getDetails()[i]);
                            List.insertInListAtPosition(ColumnManager.columns, column, i);
                            Html.insertChildAtPosition(ColumnManager.uiElement, column.getUiElement(), i);
                        }
                    }
                    ColumnManager.updateVisibilityWidthAndHeightOfColumns();
                });
            });
        } else {
            let contentFCmode = "0-30183168";
            ObjectLoader.ensureLoaded(contentFCmode, function() {
                let detailsData : DetailsData = DetailsData.map.get(contentFCmode);
                detailsData.ensureDetailsAreLoaded(function() {
                    if (true) { // first column
                        let column : Column = Column.create(null);
                        List.insertInListAtPosition(ColumnManager.columns, column, 0);
                        Html.insertChildAtPosition(ColumnManager.uiElement, column.getUiElement(), 0);
                        let urlParams : URLSearchParams = App.getUrlParams();
                        if (urlParams.has("id")) {
                            let linkToStartpage = "0-53198593";
                            ObjectLoader.ensureLoaded(linkToStartpage, function() {
                                let linkDetailsData : DetailsData = DetailsData.map.get(linkToStartpage);
                                linkDetailsData.ensureDetailsAreLoaded(function() {
                                    let obj = urlParams.get("id");
                                    ObjectLoader.ensureLoaded(obj, function() {
                                        let objDetailsData : DetailsData = DetailsData.map.get(obj);
                                        objDetailsData.ensureDetailsAreLoaded(function() {
                                            column.insertObjectAtPosition(linkToStartpage, 0);
                                            column.insertObjectAtPosition(obj, 1);
                                            column.expandSecondObject();
                                        });
                                    });
                                });
                            });
                        } else {
                            for (let i = 0; i < detailsData.getDetails().length; i++) {
                                column.insertObjectAtPosition(detailsData.getDetails()[i], i);
                            }
                        }
                    }
                    if (true) { // further columns
                        for (let i = 1; i < 3; i++) {
                            let column : Column = Column.create(null);
                            List.insertInListAtPosition(ColumnManager.columns, column, i);
                            Html.insertChildAtPosition(ColumnManager.uiElement, column.getUiElement(), i);
                        }
                    }
                    ColumnManager.updateVisibilityWidthAndHeightOfColumns();
                });
            });
        }
        window.addEventListener("resize", function(ev : UIEvent) {
            ColumnManager.updateVisibilityWidthAndHeightOfColumns();
        });
    }

    public static updateVisibilityWidthAndHeightOfColumns() {
        let numberOfColumns : number;
        if (App.LOCAL_MODE) {
            numberOfColumns = ColumnManager.getNumberOfColumnsByWindowWidth_localmode();
        } else {
            numberOfColumns = ColumnManager.getNumberOfColumnsByWindowWidth_presMode();
        }
        for (let i = 0; i < ColumnManager.columns.length; i++) {
            let column = ColumnManager.columns[i];
            let uiElement : HTMLElement = column.getUiElement();
            if (i < numberOfColumns) {
                uiElement.style.visibility = "visible";
            } else {
                uiElement.style.visibility = "hidden";
            }
            uiElement.style.width = (window.innerWidth / numberOfColumns) + "px";
            uiElement.style.height = window.innerHeight + "px"; // to enable scrolling
            column.updateHeightOfPlaceholderDiv();
        }
    }

    public static createColumnAtPosition(position : number, callback : Function) {
        SemsServer.createTextObject("[Column]", function(semsAddress : string) {
            ObjectLoader.ensureLoaded(semsAddress, function() {
                ColumnManager.detailsData.createLinkDetailAtPostion(semsAddress, position);
                let column : Column = Column.create(semsAddress);
                List.insertInListAtPosition(ColumnManager.columns, column, position);
                Html.insertChildAtPosition(ColumnManager.uiElement, column.getUiElement(), position);
                callback(column);
            });
        });
    }

    public static newColumnPrev(column : Column, callback : Function) {
        ColumnManager.createColumnAtPosition(ColumnManager.columns.indexOf(column), callback);
    }
    
    public static newColumnNext(column : Column, callback : Function) {
        ColumnManager.createColumnAtPosition(ColumnManager.columns.indexOf(column) + 1, callback);
    }

    public static moveColumnPrev(column : Column) {
        let index = ColumnManager.columns.indexOf(column);
        ColumnManager.removeColumn(column);
        setTimeout(function() { // TODO Synchronization of detailsData.deleteDetail
            let newIndex = Math.max(0, index - 1);
            ColumnManager.insertColumn(column, newIndex);
            column.focusColumnOrFirstObject();
        }, 1);
    }

    public static moveColumnNext(column : Column) {
        let index = ColumnManager.columns.indexOf(column);
        ColumnManager.removeColumn(column);
        setTimeout(function() { // TODO Synchronization of detailsData.deleteDetail
            let newIndex = Math.min(ColumnManager.columns.length, index + 1);
            ColumnManager.insertColumn(column, newIndex);
            column.focusColumnOrFirstObject();
        }, 1);
    }

    private static removeColumn(column : Column) {
        let index = ColumnManager.columns.indexOf(column);
        ColumnManager.detailsData.deleteDetail(column.userInterfaceObject.semsAddress, index);
        List.deleteInListAtPosition(ColumnManager.columns, index);
        column.userInterfaceObject.uiElement.remove();
    }

    private static insertColumn(column : Column, position : number) {
        List.insertInListAtPosition(ColumnManager.columns, column, position);
        Html.insertChildAtPosition(ColumnManager.uiElement, column.userInterfaceObject.uiElement, position);
        ColumnManager.detailsData.createLinkDetailAtPostion(column.userInterfaceObject.semsAddress, position);
    }

    public static deleteColumnEvent(column : Column) {
        let index = ColumnManager.columns.indexOf(column);
        App.addToDeletedList(column.userInterfaceObject.semsAddress);
        ColumnManager.removeColumn(column);
        ColumnManager.columns[Math.min(index, ColumnManager.columns.length - 1)].focusColumnOrFirstObject();
    }

    public static adaptWidthOfColumns() {
        let width : number = (window.innerWidth - (window.innerWidth / 60)) / ColumnManager.columns.length;
        // let width : number = (window.innerWidth) / ColumnManager.columns.length;
        ColumnManager.columns.forEach(function(column : Column) {
            column.getUiElement().style.width = width + "px";
        });
    }
    
    static getColumnWithFewestContent() : Column {
        let columnWithFewestContent : Column = ColumnManager.columns[0];
        for (let i = 0 ; i < ColumnManager.columns.length; i++) {
            let curr : Column = ColumnManager.columns[i];
            if (curr.getContentHeight() < columnWithFewestContent.getContentHeight()) {
                columnWithFewestContent = curr;
            }
        }
        return columnWithFewestContent;
    }

    public static getNumberOfColumnsByWindowWidth_presMode() : number {
        if (window.innerWidth < 1100) {
            return 1;
        } else if (window.innerWidth < 1700) {
            return 2;
        } else {
            return 3;
        }
    }
    public static getNumberOfColumnsByWindowWidth_localmode() : number {
        if (window.innerWidth < 800) {
            return 1;
        } else if (window.innerWidth < 1400) {
            return 2;
        } else {
            return 3;
        }
    }
}