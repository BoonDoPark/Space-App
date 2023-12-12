export interface SpaceDTO {
    id: number;
    spaceName: string;
    logo: string;
}

export interface UserNameDTO {
    id: number;
    nickName: string;
    userSex: string;
    profile: string;
}

export interface ResponseSpaceDTO {
    space: SpaceDTO;
    user: UserNameDTO[];
}

// 강의 상세 내용을 보고 유저 정보는 부가적일때,
export interface ResponseSpace2DTO {
    id: number;
    spaceName: string;
    logo: string;
    user: UserNameDTO[];
}

export interface AcceptCourseRequestDTO {
    userId : number,
    spaceId : number
}
