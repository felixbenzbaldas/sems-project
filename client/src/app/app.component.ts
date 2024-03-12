import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {App} from "./sems-client-src/App";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
    // not used at the moment
    @ViewChild('baseDiv') baseDiv: ElementRef | undefined;

    ngAfterViewInit(): void {
        App.runApp();
    }

}