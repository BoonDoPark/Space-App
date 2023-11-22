# Space-App

인프런 사이트를 참조하여 웹 서비스 기반 IT 학습 플랫폼 프로젝트입니다. 사용자들에게 공간이란 것을 제공하여 사용자들 간에 자유로운 소통을 할 수 있습니다. 해당 프로젝트는 백엔드 기획을 진행했습니다.

## 수행한 역할

- TypeORM 기반 Postgresql 데이터베이스 모델링
- Nest.JS 기반 백엔드 서버 구축

## 기술스택

- TypeScript
- Nest.js
- PostgreSQL
- TypeORM

## 수행 과정

- 데이터 베이스 모델링
    - 테이블 간의 관계를 어떻게 설계했는지 자세하게 서술 (OneToMany, ManyToMany, Bridge Table)
        - 하나의 유저가 다수의 게시판을 만들 수 있기 때문에, User 테이블을 기반으로 Board 테이블에 1:N 관계를 맵핑하는 OneToMany를 사용하여 설계
        - 다수의 유저가 다수의 Space를 가질 수 있기 때문에, M:N 관계를 중간에서 맵핑하는 user_mapping_space 테이블인 Bridge Table 생성
        - User 테이블과 Space 테이블 각각 user_mapping_space 테이블에 OneToMany로 맵핑하여 ManyToMany 구현
    
    - <img width="656" alt="스크린샷 2023-11-14 오후 8 21 57" src="https://github.com/BoonDoPark/Space-App/assets/76871728/131790cd-d7f2-470e-a676-f2303bc87cc6">

    
    - User
        - id: number
        - email: string
        - password: string
        - nickName: string
        - userSex: string
        - profile: string
    - Board
        - id: number
        - title: string
        - content: string
        - userId: number
    - Space
        - id: number
        - spaceName: string
        - logo: string
    - user_mapping_space
        - id: number
        - userId: number
        - spaceId: number
- 컨트롤러 구성
- 서비스 레이어 (비즈니스 로직) 구현
- TypeORM 데이터 베이스 연동 (레포지토리 레이어)

## 메뉴 구성

- 로그인
    - jwt 토큰을 활용한 로그인
        - refresh 토큰을 데이터베이스에 넣는 작업
    - guard + ROLE 를 적용한 패키지별 권한 관리
 
- Rest API 구현
    - https://www.notion.so/8607f89be7d24002aa3685d4e72fb0e2?pvs=4
