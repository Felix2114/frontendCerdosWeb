export interface TweetReaction {
  id?: number;
  userId: number;
  tweetId: number;
  reactionId: number;
  user?: User;
  tweet?: Tweet;
  reaction?: Reaction;
}

export interface User {
  id: number;
  username: string;
}

export interface Tweet {
  id: number;
  content: string;
}

export interface Reaction {
  id: number;
  description: string;
}
