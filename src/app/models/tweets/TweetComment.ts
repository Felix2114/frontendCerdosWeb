export interface TweetComment {
  content: string;
  user: {
    id: number;
    username: string;  
  };
  tweetId: number;
}
