export class Tweet {
    id: number = 0;
    tweet: String = "";
    description: String = "";
    url: String = "";
    raza: String ="";
    peso: Number = 0;
    nombre: String ="";
      postedBy: {
    id: number; // id del usuario
    username: string; // nombre de usuario
  } = { id: 0, username: "" }; 
}