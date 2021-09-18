export interface Comment {
  content: string;
  datePosted: string;
  sid: string;
  name: string;
  uid: string;
}

export interface CommentWithId extends Comment {
  id: string;
}
