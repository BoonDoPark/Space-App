export interface userInfoDTO {
    id: number;
    email: string;
    password: string;
    nickName: string;
    userSex: string;
    profile: string;
}

export interface UserDTO {
    id: number;
    email: string;
    nickName: string;
    userSex: string;
    profile: string;
}

export interface UsersDTO {
    id: number;
    nickName: string;
    userSex: string;
    profile: string;
}

export interface BoardDTO {
    id: number;
    title: string;
    content: string;
}

export interface BoardToUserDTO {
    user: UserDTO;
    board: BoardDTO[];
}