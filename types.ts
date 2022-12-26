export interface TwitterDetail {
  data: Data;
  includes: Includes;
}

export interface Data {
  edit_history_tweet_ids: string[];
  created_at: Date;
  text: string;
  id: string;
  author_id: string;
}

export interface Includes {
  users: User[];
}

export interface User {
  id: string;
  name: string;
  profile_image_url: string;
  username: string;
}
