import { IUser } from "./user";

export interface IProfile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
}

export class Profile implements IProfile {
    username: string;
    displayName: string;
    image?: string;

    constructor(user: IUser){
        this.username = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}