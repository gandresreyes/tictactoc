import { Injectable } from '@angular/core';
import { Firestore, collection,addDoc, collectionData, CollectionReference,DocumentData,doc,updateDoc, docData} from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private firestore: Firestore) { }

  startgame(game:any){
    const gameRef = collection( this.firestore, 'game');
    return addDoc(gameRef, game )

  }

  moveGame(game:any){       
    const gameRef = doc(this.firestore, `game/${game.id}`);
    return updateDoc(gameRef, { ...game }) ;  
  } 

  getGame(id:string):Observable<any>{   
    const gameRef =  doc(this.firestore, `game/${id}`);
    return docData(gameRef,{idField:'id'}) 

  }

 
  restart(game:any){
    const gameRef = doc(this.firestore, `game/${game.id}`);
    return updateDoc(gameRef, { ...game }) ; 
  }
}

