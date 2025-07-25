import { Component } from '@angular/core';
import { StorageService } from "../services/storage.service";
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweets/Tweet';
import { TweetReactionService } from '../services/tweet-reaction.service';
import { TweetReaction } from '../models/tweets/Reactions';
import { TweetComment } from '../models/tweets/TweetComment';
import { CommentsService } from '../services/comments.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
    username : string = "";
    userId : number = 0;
    tweetText : string = "";
     tweetUrl: string = '';
  tweetDescription: string = '';
  tweetNombre: string = '';
  tweetRaza: string = '';
  tweetPeso: number = 0;
    tweets:Tweet[] = [];
    

    reactionsByTweet: { [tweetId: number]: TweetReaction[] } = {};
    commentsByTweet: { [tweetId: number]: TweetComment[] } = {};
    newCommentContent: { [tweetId: number]: string } = {};
 

    constructor( private storageService : StorageService,
                 private tweetService: TweetService,
                 private tweetReactionService: TweetReactionService,
                 private commentsService: CommentsService 
               )
    {

       this.username = this.storageService.getSession("username");
       this.userId = this.storageService.getSession("userId");
        console.log("USER ID",this.userId);
   console.log("USER NAME",this.username);
 
       this.getTweets();
       this.getReactions();
      // this.getComments();
    }

    private getTweets() {
  this.tweetService.getTweets().subscribe((tweets: any) => {
    this.tweets = tweets.content;
    console.log(this.tweets);
    this.tweets.forEach((tweet: Tweet) => {
      this.getComments(tweet.id);  
    });
  });
}

 private getReactions() {
  this.tweetReactionService.getAllReactions().subscribe(data => {
    const reactions = data.content || data; 
    this.reactionsByTweet = {};
    for (let reaction of reactions) {
      const tweetId = reaction.tweetId;
      if (!this.reactionsByTweet[tweetId]) {
        this.reactionsByTweet[tweetId] = [];
      }
      this.reactionsByTweet[tweetId].push(reaction);
    }
    console.log("Reacciones agrupadas por tweet:", this.reactionsByTweet);
  });
}



getComments(tweetId: number): void {
 
  this.commentsService.getCommentsByTweet(tweetId).subscribe({
    next: (comments) => {
      this.commentsByTweet[tweetId] = comments;
    },
    error: (err) => {
      console.error("Error al obtener los comentarios:", err);
    }

   
  });
}



createComment(tweetId: number) {
  const userId = Number(this.storageService.getSession("userId"));

  if (!userId) {
    console.error("Usuario no autenticado");
    return;
  }

 
  if (!this.newCommentContent[tweetId]?.trim()) {
    console.warn("Comentario vacío");
    return;
  }

  const newComment = {
    tweetId: tweetId,
    content: this.newCommentContent[tweetId]
  };

  this.commentsService.createComment(newComment).subscribe({
    next: (createdComment) => {
      console.log("Comentario creado:", createdComment);

      if (!this.commentsByTweet[tweetId]) {
        this.commentsByTweet[tweetId] = [];
      }
      this.commentsByTweet[tweetId].push(createdComment);

      
      this.newCommentContent[tweetId] = ''; 
    },
    error: (error) => {
      console.error("Error al crear comentario:", error);
    }
  });
}






  addTweet() {
    const newTweet: Tweet = {
      id: 0,
      tweet: this.tweetText,
      url: this.tweetUrl,
      description: this.tweetDescription,
      nombre: this.tweetNombre,
      raza: this.tweetRaza,
      peso: this.tweetPeso,
      postedBy: {
      id: +this.userId, 
      username:  this.username
    }
    };

    this.tweetService.postTweet(newTweet).subscribe((response: any) => {
      this.getTweets(); 
      this.tweetText = '';
      this.tweetUrl = '';
      this.tweetDescription = '';
      this.tweetNombre = '';
      this.tweetRaza = '';
      this.tweetPeso = 0;
    });

  } 
 

  addReaction(tweetId: number, reactionId: number) {
    const userId = Number(this.storageService.getSession("userId")); 
    if (!userId) {
      console.error("Usuario no autenticado");
      return;
    }

    const newReaction = {
      userId: userId,
      tweetId: tweetId,
      reactionId: reactionId
    };

    this.tweetReactionService.createTweetReaction(newReaction).subscribe({
      next: (response) => {
        console.log("Reacción creada:", response);
        this.getReactions(); // refresca reacciones
      },
      error: (error) => {
        console.error("Error al crear reacción:", error);
      }
    });
  }


  getReactionCounts(tweetId: number): { [key: string]: number } {
  const counts: { [key: string]: number } = {};

  const reactions = this.reactionsByTweet[tweetId] || [];

  for (const reaction of reactions) {
    const description = reaction.reaction?.description || 'Desconocida';
    counts[description] = (counts[description] || 0) + 1;
  }

  return counts;
}


}
