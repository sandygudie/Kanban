export interface IChat {
  createdBy: {
    id: string;
    name: string;
    profilePics: string;
    email: string;
  };
  _id: string;
  roomId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
