import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { GameService } from '../../servicio/game.service';
declare var window:any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('content') content!:ElementRef 
  @ViewChild('table') table!:ElementRef 

  squere:any = []; 
  counter:number = 0; 
  you:number = 0;
  idGame:string = "";
  startGame:boolean = false;
  game:any = [];
  addcode = "";
  viewInput:boolean = false;
  error:boolean = false;
  modal:any=null;
  constructor( private gameSvc: GameService, private renderer:Renderer2){}
  ngOnInit(): void { 
    this.squere = Array(9).fill(null); 
    this.game = {"tablero":this.squere} 
   
  }
  // se crea un nuevo juego
  async newGame(){  
    this.viewInput=false     
    this.counter = 0;
    this.you = 1;   

    const newGame = {
      "tablero":this.squere,
      "ganador":false,
      "jugadorWin":"",
      "empate":false,
      "contador":this.counter,
      "jugador1":true,
      "jugador2":false,
      "turno":1,
      "intgame":1
     }
    const response = await  this.gameSvc.startgame(newGame)
    this.game = newGame;
    this.idGame = response.id;  
    this.startGame = true; 
    this.renderer.addClass(this.content.nativeElement , 'traslete')
    this.getGame();
    
  }
  async getGame(){      
    await this.gameSvc.getGame(this.idGame).subscribe(data=>{      
      this.game = data;     
      this.counter = data.contador;      
      if(data.ganador){
        this.openModal()
      }
      if(data.contador == 0  && this.modal != null ){
        this.modal.hide(); 
      }      
    })
  }
  //0 1 2
  //3 4 5
  //6 7 8
  //detecta y marca el moviemiento de los jugadores
  async makeMove(e:any){     

    if(this.game.turno==this.you && !this.game.ganador && e.target.getAttribute('posicion') != null && this.game.jugador2) {
      this.getGame()      
      this.squere = this.game.tablero 
      const posicion = e.target.getAttribute('posicion') 
      this.squere[posicion] = this.you  
        this.counter = this.game.contador
        this.counter++;      
        const turno =  this.you == 1?2:1
        let winner= false
        let jugadrwin = 0; 
        let empate = false

        //validacion del ganador 
        for( let i = 1 ; i<= 2; i++){
          if((this.game.tablero[0] == i && this.game.tablero[1] == i && this.game.tablero[2] == i)||
        (this.game.tablero[3] == i && this.game.tablero[4] == i && this.game.tablero[5] == i) ||
        (this.game.tablero[6] == i && this.game.tablero[7] == i && this.game.tablero[8] == i) ||

        (this.game.tablero[0] == i && this.game.tablero[3] == i && this.game.tablero[6] == i) ||
        (this.game.tablero[1] == i && this.game.tablero[4] == i && this.game.tablero[7] == i) ||
        (this.game.tablero[2] == i && this.game.tablero[5] == i && this.game.tablero[8] == i) ||

        (this.game.tablero[0] == i && this.game.tablero[4] == i && this.game.tablero[8] == i) ||
        (this.game.tablero[2] == i && this.game.tablero[4] == i && this.game.tablero[6] == i)         
        
        ){
          winner = true ;
          jugadrwin = i ;
          break;
        } 
        // sino hay gandor y hay 9 movimientos
        if(!winner && this.counter==9 ){
          empate = true
        }
      }   
      //enviamos a la funcion de editar   
        const update = {"tablero":this.squere, "id":this.idGame , "turno": turno , "ganador":winner, "contador":this.counter , "jugadorWin":jugadrwin , "empate":empate}  
        await this.gameSvc.moveGame(update)
       
       
    }  
  }
  
  //agregar el nuevo jugador
  async addGamer(){        
    
      this.idGame = this.addcode.trim();
      this.you = 2 ; 
      this.viewInput = false;
      this.startGame = true;     
      const user = {"id":this.idGame, "jugador2":true} 
      this.renderer.addClass(this.content.nativeElement , 'traslete')      
      this.getGame() 
      await this.gameSvc.moveGame(user) 
         
     
  }
  //restableceel juego 
  async restart(){ 
    let initGame = this.game.intgame == 1?2:1    
    this.squere = Array(9).fill(null);
    const reset ={"tablero":this.squere,"id":this.idGame , "turno": initGame,  "ganador":false,"jugadorWin":"","empate":false ,"contador":0,"intgame":initGame  }
    await this.gameSvc.moveGame(reset)
    
  }

  openModal(){
    if(this.modal==null){
      this.modal= new window.bootstrap.Modal('#resultModal')
    }   
    this.modal.show();
  }


}
