import { App } from "../App";

export class ServerRequest {
    public args : Map<string, string> = new Map();
    public content : any;
    public callback : (object : any) => void;
    public type : string;
    static TYPE_POST = "POST";
    static TYPE_GET = "GET";
    public setType_POST() {
        this.type = ServerRequest.TYPE_POST;
    }
    public setType_GET() {
        this.type = ServerRequest.TYPE_GET;
    }
    public setArg(key : string, value : string) {
        this.args.set(key, value);
    }
    
    private request : XMLHttpRequest = new XMLHttpRequest();
    public doRequest() {
        let self = this;
        self.setArg("auth", App.getUrlParams().get("auth"));
        this.request.onreadystatechange = function () {
            if (self.callback != null) {
                if (this.readyState == 4 && this.status == 200) {
                    let receivedString : string;
                    receivedString = this.responseText;
                    self.callback(receivedString.trim());
                }
            }
        };
        let args = "";
        self.args.forEach(function(value, key) {
            if (args.length != 0) {
                args += "&";
            }
            args += key + "=" + value;
        });
        this.request.open(self.type, "http://localhost:8080/server/servlet/?" + args, true);
        this.request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
        this.request.send(JSON.stringify(this.content));
    }
}