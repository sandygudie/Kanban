export interface IChat {
  createdBy: {
    id: string;
    name: string;
    profilePics: string;
    email: string;
  };
  replyTo: IChat;
  _id: string;
  roomId: string;
  message: string;
  createdAt: Date;
  isEdited:boolean;
  updatedAt: Date;
  emojiReactions: { emoji: string; users: string[] }[];
}
