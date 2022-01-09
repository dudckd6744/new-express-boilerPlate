# TEST 전

#### !Redis 모듈을 이용하여 로컬환경에 Redis 가 설치되어야 되며 실행이 되어있어야 됩니다.

```
$ brew install redis
$ brew services start redis
```
깃 클론 이후
```
$ npm i
```
개발 환경
```
$ npm run dev
```
배포 환경
```
$ npm run start
```

# 인증 체계 셋팅
### front 환경
#### [front 에서 refreshToken 자동갱신](https://slog.website/post/10 'front 에서 refreshToken 자동갱신') 해당 사이트 처럼 해줄때
- access Token 이 만료되었을때
  - api 요청으로 refreshToken을 이용해 accessToken 을 갱신 해준다 
    - 변경 (api 요청을 없애서 서버 요청 횟수를 줄인다.)
  - RefreshToken만 body 에 넣어 API 요청을 보내 accessToken 을 갱신 해준다 
    - 변경 (access , refresh 토큰을 같이 header 에 넣어서 보낸다.)
    - 
### description
#### 해당 로직은 로그인 이후 로그아웃 이나 오랫동안 활동을 안할경우 제외하고는 계속 로그인을 유지시켜주는 로직으로 구현해보았습니다.

### FLOW
#### 최초 로그인시
- token = signing(user.UUID); `유효기간은 1일` 
- refreshToken = reFreshsigning(); `유효기간 2주 이며 payload에 정보를 담지않고 AccessToken 갱신용으로만`


레디스 이용 `AccessToken 을 갱신할때 필요한 유저 ID 와, RefreshToken 을 갱신할때 필요한 Expire 를 제공`
- redis.set(refreshToken, user.UUID) `유효기간은 refresh 토큰과 동일하게`
- redis.set(user.UUID, "") `유효기간은 refresh 토큰과 동일하게`

#### RefreshFlow

- access 유효 
  - access 토큰 복호화해서 UUID 를 req.user에 붙여서 넘긴다
- access 만료되고 refresh 유효할때
  - refresh 토큰과 Redis 를 이용하여 access 토큰을 갱신 시켜준다음 token 를 req.token 붙여서 넘기고 token을 response해준다. => client 에서 로컬스토리지에 로컬변수지정
- access 만료되고 refresh 만료 `오랫동안 활동이 없는 유저 , 로그아웃 유저`
  - err 날려준다.
- access 유효하고 refresh 만료 `AccessToken 만 header로 받을때 실행`
  - refresh 토큰과 Redis 데이터 expire 가 같으므로 Redis Data의 유무를 확인
  - Redis Data 가 null 일때 refresh 토큰을 갱신후에 쿠키에 박아준다
  - 갱신한 refresh 토큰 과 UUID 를 다시 redis에 넣어준다.
  - access 토큰을 복호화해서 UUID 를 req.user 에 붙여서 넘긴다


# API token
#### 로그인 시
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVVUlEIjoiOWVlM2RkMDgtOWFmNS00ZGQyLThkM2QtYzgxZGMxMjQyZTU5IiwiaWF0IjoxNjQwMzI5ODE2LCJleHAiOjE2NDAzMjk4NzZ9.G4vYPGXt8YkwJdOLHUPT_lBA8rV4e37o76TFBrYKbZM",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDAzMjk4MTYsImV4cCI6MTY0MDMyOTgyNn0.3VNe_sYFzk-SkbrV-vjNJNtSeWM39mDa2Tq6NErvE_Y"
}
```
# 응답 포맷 세팅

### Success
```
{
    "success": true,
    "response": {
        "taskId": 18,
        "information": ex ,
        ....
    },
    "error": null
}
```
### Exception
```
{
    "success": false,
    "response": null,
    "error": {
        "status": 400,
        "message": <err message>
    }
}
```

# 추가 사용한 라이브러리

| name               | version      | description                      |
| ------------------ | ------------ | -------------------------------- |
| dotenv             | ^10.0.0      | 환경변수를 파일로 설정 가능      |
| multer             | ^1.4.4       | 파일 업로드를 위해 사용되는 multipart/form-data를 다루기 위한 node.js 의 미들웨어이다.|
| multer-3           | ^2.10.0      | 파일을 S3에 바로 업로드할 수 있도록 도와주는 모듈 |
| aws-sdk            | ^2.980.0     | Software Development Kit의 약자로 AWS를 프로그래밍적으로 제어하기 편리하도록 제공되는 라이브러리들을 의미합니다|
| redis              | ^4.0.1       | 인-메모리 방식의 데이터 저장소로 캐시서버를 구성하는데 사용되는 오픈소스입니다.|



