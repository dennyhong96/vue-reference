export interface Song {
  uid: string;
  displayName: string;
  originalName: string;
  modifiedName: string;
  genre: string;
  commentCount: number;
  url: string;
}

export interface SongWithId extends Song {
  id: string;
}
