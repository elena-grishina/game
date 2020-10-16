import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, SubscriptionLike, timer } from 'rxjs';
import { delay, map } from 'rxjs/operators';

interface IModalData {
    title: string;
    text: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    cells: string[];
    userCounter = 0;
    compCounter = 0;
    gameIsRunning = false;
    delay = 10;
    isModal = false;
    modalData: IModalData;
    isLastFailed = true;

    gameRunner$: Observable<number>;
    gameRunnerSubscription: SubscriptionLike = Subscription.EMPTY;

    ngOnInit(): void {
        this.cells = Array(100);
    }

    onStart(): void {
        this.reset();
        this.gameRunner$ = timer(0, this.delay * 100);
        this.gameIsRunning = true;

        this.gameRunnerSubscription = this.gameRunner$
            .pipe(
                map(() => {
                    const num = this.getRundomNumber();
                    if (!(this.isLastFailed && this.compCounter > 8)) {
                        this.cells[num] = 'yellow';
                    }
                    this.isLastFailed = true;
                    return num;
                }),
                delay(this.delay * 100)
            )
            .subscribe((num: number) => {
                if (this.cells[num] === 'yellow') {
                    this.cells[num] = 'red';
                    this.compCounter++;

                    if (this.compCounter === 10) {
                        this.showModal(false);
                    }
                }
            });
    }

    getRundomNumber(): number {
        const num = Math.floor(Math.random() * (100));
        return this.cells[num] ? this.getRundomNumber() : num;
    }

    showModal(isUserWinner = true) {
        this.gameRunnerSubscription.unsubscribe();
        this.gameIsRunning = false;

        this.modalData = {
            title: isUserWinner ? 'Congratulations!' : 'Oh no!',
            text: isUserWinner ? 'You are a winner! :)' : 'You are a loser! :('
        };
        this.isModal = true;
    }

    ngOnDestroy(): void {
        this.gameRunnerSubscription.unsubscribe();
    }

    reset(): void {
        this.userCounter = 0;
        this.compCounter = 0;
        this.cells = Array(100);
    }

    onFieldClick(index: string): void {
        if (!index || !this.gameIsRunning) {
            return;
        }

        if (this.cells[+index] === 'yellow') {
            this.cells[+index] = 'green';
            this.userCounter++;
            this.isLastFailed = false;

            if (this.userCounter === 10) {
                this.showModal();
            }
        }
    }

    onCloseModal(target: HTMLElement): void {
        if (target.className.includes('close')) {
            this.isModal = false;
        }
    }

    trackByFn(index: number): number {
        return index;
    }
}
