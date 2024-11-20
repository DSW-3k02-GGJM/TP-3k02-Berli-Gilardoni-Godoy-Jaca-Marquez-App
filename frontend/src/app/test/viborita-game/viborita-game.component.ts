import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-viborita-game',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './viborita-game.component.html',
  styleUrl: './viborita-game.component.scss'
})
export class ViboritaGameComponent implements OnInit, OnDestroy {
  private gameId: any;
  private key: string | undefined;
  win = false
  cells: number[] = Array(10).fill(0);
  rows: number[] = Array(6).fill(0);


  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    this.key = event.key;
  }

  ngOnInit(): void {
    this.startGame();
  }
  
  ngOnDestroy(): void {
    this.stopGame();
  }

  startGame(){
    let dir = 'right';
    let snakeLength = 3;
    let snakeHeadCell = 'c13'
    let newSnakeHeadCell = 'c14';
    let newCol = 1;
    let newRow = 4;
    let nextSnakeBodyCell = 'c13';
    this.generateSnake();
    this.newApple();

    this.gameId = setInterval(() => {
      if (this.key === 'w' && dir !== 'down') {
        dir = 'up';
      } 
      else if (this.key === 's' && dir !== 'up') {
        dir = 'down';
      } 
      else if (this.key === 'a' && dir !== 'right') {
        dir = 'left';
      } 
      else if (this.key === 'd' && dir !== 'left') {
        dir = 'right';
      }


      snakeHeadCell = this.getSnakeId('1');
      if (dir === 'right') {
        newSnakeHeadCell = "c" + snakeHeadCell[1] + (parseInt(snakeHeadCell[2]) + 1);
        newCol = parseInt(snakeHeadCell[2]) + 1;
        newRow = parseInt(snakeHeadCell[1]);
      } 
      else if (dir === 'left') {
        newSnakeHeadCell = "c" + snakeHeadCell[1] + (parseInt(snakeHeadCell[2]) - 1);
        newCol = parseInt(snakeHeadCell[2]) - 1;
        newRow = parseInt(snakeHeadCell[1]);
      } 
      else if (dir === 'up') {
        newSnakeHeadCell = "c" + (parseInt(snakeHeadCell[1]) - 1) + snakeHeadCell[2];
        newCol = parseInt(snakeHeadCell[2]);
        newRow = parseInt(snakeHeadCell[1]) - 1;
      } 
      else if (dir === 'down') {
        newSnakeHeadCell = "c" + (parseInt(snakeHeadCell[1]) + 1) + snakeHeadCell[2];
        newCol = parseInt(snakeHeadCell[2]);
        newRow = parseInt(snakeHeadCell[1]) + 1;
      }
      
      if(this.cellHaveApple(newSnakeHeadCell)) {
        this.removeClass(newSnakeHeadCell, 'apple');
        snakeLength++;
        if (snakeLength > 100) { 
          this.stopGame();
          this.win = true;
        }
        this.newApple();
      }


      this.removeClass(snakeHeadCell, 'snake-head');
      this.removeClass(snakeHeadCell, '1');

      this.removeClass(newSnakeHeadCell, 'empty');
      this.addClass(newSnakeHeadCell, 'snake-head');
      this.addClass(newSnakeHeadCell, '1');
      nextSnakeBodyCell = snakeHeadCell;
      for (let i = 2; i <= snakeLength; i++) {
        let tempSnakeBodyCell = this.getSnakeId(i.toString());
        if (tempSnakeBodyCell !== '') {
          this.removeClass(tempSnakeBodyCell, 'snake-body');
          this.removeClass(tempSnakeBodyCell, i.toString());
        }

        this.addClass(nextSnakeBodyCell, 'snake-body');
        this.addClass(nextSnakeBodyCell, i.toString());

        nextSnakeBodyCell = tempSnakeBodyCell;
      }
    
      this.addClass(nextSnakeBodyCell, 'empty');

      if (this.cellIsDead(newSnakeHeadCell)) {
        this.stopGame();
        this.win = false;
        return false;
      }

    }, 150);
  }

  stopGame() {
    clearInterval(this.gameId);
    console.log(this.win);
  }


  addClass(elementId: string, className: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add(className);
    }
  }

  removeClass(elementId: string, className: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove(className);
    }
  }

  getSnakeId(className: string): string {
    const snakeHeadElement = document.getElementsByClassName(className);
    if (snakeHeadElement.length > 0) {
      return snakeHeadElement[0].id;
    }
    else {
      return '';
    }
  }

  newApple(): void {
    const elements = document.getElementsByClassName('empty');
    if (elements.length > 0) {
      const randomIndex = Math.floor(Math.random() * elements.length);
      const randomElement = elements[randomIndex];
      randomElement.classList.remove('empty');
      randomElement.classList.add('apple');
      console.log(randomElement);
    }
  }

  cellHaveApple(cellId: string): boolean {
    const cell = document.getElementById(cellId);
    return cell ? cell.classList.contains('apple') : false;
  }

  cellIsDead(cellId: string): boolean {
    const cell = document.getElementById(cellId);
    return cell ? cell.classList.contains('snake-body') : true;
  }

  generateSnake(){
    this.removeClass('c11', 'empty');
    this.removeClass('c12', 'empty');
    this.removeClass('c13', 'empty');

    this.addClass('c11', 'snake-body');
    this.addClass('c12', 'snake-body');
    this.addClass('c13', 'snake-head');

    this.addClass('c11', '3');
    this.addClass('c12', '2');
    this.addClass('c13', '1');
  }
}
