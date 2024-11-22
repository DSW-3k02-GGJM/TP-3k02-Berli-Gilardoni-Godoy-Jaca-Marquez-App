import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { set } from 'date-fns';

@Component({
  selector: 'app-viborita-game',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './viborita-game.component.html',
  styleUrl: './viborita-game.component.scss'
})
export class ViboritaGameComponent implements OnInit, OnDestroy {
  private gameId: any;
  private key: string | undefined;
  win = false
  disabled = false
  cells: number[] = Array(10).fill(0);
  rows: number[] = Array(6).fill(0);

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2
  ) {}

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    this.key = event.key;
  }

  ngOnInit(): void {
  }
  
  ngOnDestroy(): void {
    this.stopGame();
  }

  setGame(){  
    if (!this.disabled) {
      clearInterval(this.gameId);
      this.clearSnake();
      this.disabled = true;
      this.win = false;
      this.removeClass('menu', 'active');
      this.removeClass('after', 'active');
      this.addClass('game', 'active');
      this.startGame();
    }  
  }

  startGame(){
    console.log('start game');

    let dir = 'right';
    this.key = 'd';
    let snakeLength = 3;
    this.generateSnake();
    this.newApple();

    setTimeout(() => {
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
  
        let snakeHeadCell = this.getSnakeId('1');
        let newSnakeHeadCell = '';
        let newCol = 0;
        let newRow = 0;

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
        let nextSnakeBodyCell = snakeHeadCell;
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
        if(newSnakeHeadCell !== nextSnakeBodyCell) {
          this.addClass(nextSnakeBodyCell, 'empty');
        }
  
        if (this.cellIsDead(newSnakeHeadCell)) {
          this.removeClass(newSnakeHeadCell, 'snake-body');
          this.stopGame();
          this.win = false;        
        }
      }, 150);
    }, 200);
  }

  stopGame() {
    console.log('stop game');
    clearInterval(this.gameId);
    setTimeout(() => {
      this.clearSnake();
      this.removeClass('game', 'active');
      this.addClass('after', 'active');
      this.disabled = false;
    }, 500);
    
  }

  clearSnake() {
    const snakeHeadElements = document.getElementsByClassName('game-cell');
    if (snakeHeadElements.length > 0) {
      for (let i = 0; i < snakeHeadElements.length; i++) {
        snakeHeadElements[i].className = 'game-cell empty';
      }
    }
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

  goToMenu (){
    this.disabled = true;
    this.removeClass('after', 'active');
    this.addClass('menu', 'active');
    this.disabled = false;
  }
}
