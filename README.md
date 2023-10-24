# Space-App

인프런 사이트를 참조하여 웹 서비스 기반 IT 학습 플랫폼 프로젝트입니다. 사용자들에게 공간이란 것을 제공하여 사용자들 간에 자유로운 소통을 할 수 있습니다. 해당 프로젝트는 프론트엔드, 백엔드로 기획을 진행하고 있습니다.

## 수행한 역할

- TypeORM 기반 Postgresql 데이터베이스 모델링
- Nest.JS 기반 백엔드 서버 구축

## 기술스택

- TypeScript
- Nest.js
- PostgreSQL
- TypeORM

## APP 구성

- 로그인
    - jwt 토큰을 활용한 로그인
        - refresh 토큰을 데이터베이스에 넣는 작업
    - guard 를 적용한 권한 관리

- 기본 CRUD 기능 구현
    - User
        - Board
            - Content
    - Auth
    - Space
        - ROLE

- oneToMany, ManyToMany
    - Typeorm 을 활용한 테이블 모델링
    - Bridge Table 활용한 ManyToMany 