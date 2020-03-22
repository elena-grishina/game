import { Component, OnInit, Renderer2 } from '@angular/core';

interface IModalData {
    title: string;
    text: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    cells: any[];
    userCounter = 0;
    compCounter = 0;
    gameIsRunning = false;
    delay = 1000;
    greenArr: number[] = [];
    redArr: number[] = [];
    isModal = false;
    modalData: IModalData;

    constructor(
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.cells = Array(100);
    }

    onStart(field: HTMLDivElement): void {
        const cell: HTMLCollection = field.children;
        this.reset(cell);
        this.gameIsRunning = true;
        this.step(cell);
    }

    step(cell: HTMLCollection): void {
        if (!this.gameIsRunning) {
            return;
        }

        const randomNumber = Math.floor(Math.random() * (100));
        const randomCell = cell[randomNumber];
        this.renderer.addClass(randomCell, 'yellow');

        setTimeout((): void => {
            if (!randomCell.className.includes('green')) {
                this.renderer.removeClass(randomCell, 'yellow');
                this.renderer.addClass(randomCell, 'red');
                this.compCounter++;
                this.redArr.push(randomNumber);

                if (this.compCounter === 10) {
                    this.gameIsRunning = false;
                    this.modalData = {
                        title: 'Oh no!',
                        text: 'You are a loser! :('
                    };
                    this.isModal = true;
                }
            } else {
                this.greenArr.push(randomNumber);
            }
            this.step(cell);

        }, this.delay);
    }

    reset(cell: HTMLCollection): void {
        this.userCounter = 0;
        this.compCounter = 0;

        this.redArr.forEach((elem: number) => {
            this.renderer.removeClass(cell[elem], 'red');
        });
        this.greenArr.forEach((elem: number) => {
            this.renderer.removeClass(cell[elem], 'green');
        });

        this.redArr = [];
        this.greenArr = [];
    }

    onFieldClick(target: HTMLElement): void {
        if (!this.gameIsRunning) {
            return;
        }
        const className = target.className;

        if (className.includes('yellow')) {
            this.renderer.removeClass(target, 'yellow');
            this.renderer.addClass(target, 'green');
            this.userCounter++;

            if (this.userCounter === 10) {
                this.gameIsRunning = false;
                this.modalData = {
                    title: 'Congratulations!',
                    text: 'You are a winner! :)'
                };
                this.isModal = true;
            }
        }
    }

    closeModal(): void {
        this.isModal = false;
    }
}
