import { IPhoto } from "./photo";
import { IUser } from "./user";

export interface IProfile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    photos?: IPhoto[];
    followersCount: number;
    followingCount: number;
    following: boolean;
}

export class Profile implements IProfile {
    username: string;
    displayName: string;
    image?: string;
    photos?: IPhoto[];
    followersCount = 0;
    followingCount = 0;
    following = false;

    constructor(user: IUser){
        this.username = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}