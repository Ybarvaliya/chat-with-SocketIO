export interface User {
  _id: string;
  fullName: string;
  username: string;
  profilePic: string;
  //     password: string,
  //     gender: string,
  //     timestamps: string,
}

export interface ChatType {
  _id: string;
  fullName: string;
  profilePic: string;
}

export interface MessageType {
  _id: string;
  message: string;
  senderId?: string;
  createdAt?: string;
  updatedAt?: string;
}
