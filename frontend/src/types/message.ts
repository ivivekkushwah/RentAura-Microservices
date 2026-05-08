// types/message.ts

export interface IUserMini {
  id: string
  fullname: string
  avatar?: string
}

export interface Message {
  _id: string              // alias of _id
   roomId: string 
  senderId: string
  senderName: string
  content: string
  replyTo?: string | null
  isDeleted: boolean
  timestamp: string;        // alias of createdAt
  tempId?: string
}

export interface IMessageThread {
  _id: string              // alias of _id
  title:string;
  threadKey: string
  ownerId: string
  userId: string
  roomId: string
  roomName?: string | null
  messages: Message[]
  unreadByOwner: number
  owner?: IUserMini       // populated
  user?: IUserMini  
  unreadByUser: number
  lastMessageAt: Date
  unreadCount: number
  roomTitle?: string | null   // ✅ add this
  

}

export interface User {
  _id: string
  fullname?: string | null   // allow null/missing
  role: "owner" | "user"
  avatar?: string
  status?: "online" | "offline" | "away"
}

