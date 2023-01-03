export interface TwitterDetail {
  data: Data;
  includes: Includes;
  errors?: TwitterError[];
} 

export interface TwitterError {
    value:         string;
    detail:        string;
    title:         string;
    resource_type: string;
    parameter:     string;
    resource_id:   string;
    type:          string;
}

export interface Data {
  referenced_tweets: ReferencedTweet[];
  edit_history_tweet_ids: string[];
  attachments: Attachments;
  text: string;
  created_at: Date;
  conversation_id: string;
  author_id: string;
  id: string;
}

export interface ReferencedTweet {
  type: "quoted" | "replied_to";
  id: string;
}

export interface Attachments {
  media_keys: string[];
}

export interface Includes {
  media: Media[];
  users: User[];
}

export interface Media {
  alt_text: string;
  media_key: string;
  type: string;
  url: string;
}

export interface User {
  username: string;
  profile_image_url: string;
  name: string;
  id: string;
}
