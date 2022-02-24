# KWONGLE DRIVE :cloud:
> 서버 로컬 스토리지(SDD, HDD) 기반 클라우드 저장소 서비스

## 주요 기능
- 파일 업로드/생성/삭제/변경/검색
- 사진 보기 및 비디오 스트리밍
- 폴더 생성
- 저장소 전체 분할 다운로드 예약 기능 (takeout)
- 사용자간 폴더 공유
  
## 기술 스택
최신 수정 날짜: 2022/02/21
- Node JS & Express
- HTML/CSS/JAVSCRIPT, VUE JS
- mysql
- prisma
- ...계속해서 추가
## API 문서

version: 1.0 (2022/02/21)

<details>
<summary>AUTH</summary>
<div markdown="1">

- auth
    
    
    |  | 메서드 | EndPoint |
    | --- | --- | --- |
    | Login(로그인) | POST | /auth/login |
    | signup(회원가입) | POST | /auth/signup |
    1. Login
        - EndPoint: [POST] auth/login
        - Description: username과 password로 로그인합니다. token을 return합니다.
        
        **Request Example**
        
        ```jsx
        {
        	"email": "Test"
        	"password": "Password1"
        }
        ```
        
        **Response Example**
        
        성공시
        
        ```jsx
        {
        	"success": true,
        	"message": null,
        	"accesToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OThkZGI2MzIyYWMxMDExZTA"
        	"user_id" : 1
        }
        ```
        
        실패시
        
        ```jsx
        {
        	"success": false,
        	"message": "패스워드나 아이디가 일치하지 않습니다",
        }
        ```
        
    2. signup
        - EndPoint: [POST] auth/register
        - Description: username과 password, email로 가입을 시도합니다.
        
        **Request Example**
        
        ```jsx
        {
        	"password": "Password1"
        	"email": "email@test.com"
        }
        ```
        
        **Response Example**
        
        성공시
        
        ```jsx
        {
        	"success": true,
        	"message": "회원가입이 완료되었습니다.",
        }
        ```
        
        실패시
        
        ```jsx
        {
        	"success": null,
        	"message": "eamail이 이미 존재합니다.",
        }
        ```
        

---
</div>
</details>

<details>
<summary>DRIVE</summary>
<div markdown="1">

- drive (http://hostname:port/drive) (드라이브내 폴더 구조 및 용량 파일 상세 정보 확인)
    
    
    |  | 메서드 | 엔드포인트 | 구현  여부 |
    | --- | --- | --- | --- |
    | 1. 유저 드라이브 생성하기 | POST | /drive | o |
    | 2. Path내 파일 및 폴더 구조 정보 가져오기 | GET | /drive/directory/{encodedPath} | o |
    
    1. 유저 드라이브 생성하기
        - EndPoint: [POST] /drive
        - Description: 유저의 드라이브를 생성합니다.
        
        **Request Example**
        
        - EndPoint: [GET] drive/folders/{path}
        
        ```jsx
        //Request Parameter
        {
        	"userId" : 1,
        	"capacity" : 15
        }
        //Request Header
        {
        	"x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OThkZGI2MzIyYWMxMDExZTA"
        }
        ```
        
        **Response Example**
        
        ```jsx
        {
        	"success": true,
        	"message": "유저의 드라이브가 생성되었습니다.",
        }
        ```
        
    2. Path내 파일 및 폴더 구조 정보 가져오기
        - EndPoint: [GET] drive/folders/:path
        - Description: ${path} 경로 내에 있는 폴더와 파일 정보들을 return합니다.
        
        **Request Example**
        
        - EndPoint: [GET] drive/folders/{path}
        
        ```js
        //RouteParameter : path정보가 들어감 ex) myPictures
        {
        	"path" : "FserjlWE" // {encodedPath} with base62
        }
        
        //Query Parameter
        {
        	"userId" : 1
        }
        //Request Header
        {
        	"x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OThkZGI2MzIyYWMxMDExZTA"
        }
        ```
        
        **Response Example**
        
        ```js
        {
        	"success": true,
          "error": null,
          "message" : "",
          "rootPath": "/documents",
        	"files":[
        		{
                    'filename': "myFolder", 
                    "type": "directory", 
                    "extension": null,
                    "contentType": null,
                    "path": "/documents/myFolder",
                    "atime":"2022-02-07T09:55:43.724Z",
                    "ctime":"2022-02-07T09:55:43.724Z",
                    "mtime":"2022-02-07T09:55:43.724Z",
                    'birthtime': "2022-02-07T09:55:43.724Z",
        						"size" : 0
                },
                {
                    'filename': "myVideo",
                    "type": "file",
                    "extension": 'mp4',
                    "contentType": 'video',
                    "path": "/documents/myVideo.mp4",
                    "atime":"2022-02-07T09:55:43.724Z",
                    "ctime":"2022-02-07T09:55:43.724Z",
                    "mtime":"2022-02-07T09:55:43.724Z",  
                    'birthtime': "2022-02-07T09:55:43.724Z",  
        						"size" : 3423424
                },
                {
                    'filename': "myPicture",
                    "type": "file",
                    "extension": 'png',
                    "contentType": 'image',
                    "path": "/documents/myPicture.png",
                    "atime":"2022-02-07T09:55:43.724Z",
                    "ctime":"2022-02-07T09:55:43.724Z",
                    "mtime":"2022-02-07T09:55:43.724Z",
                    'birthtime': "2022-02-07T09:55:43.724Z",
        						"size" : 434322
                },
                {
                    'filename': "memo.txt",
                    "type": "file",
                    "extension": 'txt',
                    "contentType": 'text',
                    "path": "/documents/memo.txt",
                    "atime":"2022-02-07T09:55:43.724Z",
                    "ctime":"2022-02-07T09:55:43.724Z",
                    "mtime":"2022-02-07T09:55:43.724Z",
                    'birthtime': "2022-02-07T09:55:43.724Z",
        						"size" : 344
                }
            ]
        }
        ```


---
</div>
</details>


<details>
<summary>FILE</summary>
<div markdown="1">

- files (http://hostname:port/file) (파일 및 디렉토리 다운로드 / 삭제 / 수정)
    
    
    |  | 메서드 | 엔드포인트 | 구현 여부 |
    | --- | --- | --- | --- |
    | 1. 파일 업로드  | POST | /file | o |
    | 2. 파일 다운로드 | GET | /file/{encodedPath} | o |
    | 3. 디렉토리 생성 | POST | /file/directory | o |
    | 4. 파일/디렉토리 삭제 | DELETE | /file/{encodedPath} | o |
    | 5.파일/ 폴더명 변경 | PATCH | /file | o |
    | 6. 이미지 프리뷰 다운로드 | GET | /file/image-preview | x |
    | 7. 비디오 스트리밍  | GET |  | x |
    1. 파일 업로드
        - EndPoint: [POST] file/upload
        - Description:  지정한 경로에 파일들을 업로드 합니다.
        
        **Supported Media Types**
        
        <aside>
        📎 multipart/form-data
        
        </aside>
        
        **Request Example**
        
        ```jsx
        //Request Header Parameter
        {
        	"x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OThkZGI2MzIyYWMxMDExZTA"
        }
        
        //Query Params
        {
        	"userId" : 1
        }
        //Requset Parameters 순서를 지켜야함
        {
        	"path" : "pics/me"
        	"filesToUpload": files[],
        }
        ```
        
        **Response Example**
        
        - 성공시
        
        ```jsx
        {
        	"success": true,
        	"message": "업로드가 성공적으로 완료되었습니다.",
        	"error": null,
        }
        ```
        
        - 실패시
        
        ```jsx
        {
        	"success": null,
        	"message": "업로드에 실패하였습니다.",
        	"error": true,
        }
        ```
        
    2. 파일 다운로드
        - EndPoint: [GET] file/{path]
        - Description:  파일을 다운로드 합니다.
        
        **Request Example**
        
        ```jsx
        //Router Parameters
        {
        	"path": "FserjlWE" // {encodedPath} with base62
        }
        
        //Query Params
        {
        	"userId" : 1
        }
        
        //Request Header Parameter
        {
        	"x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OThkZGI2MzIyYWMxMDExZTA"
        }
        ```
        
        **Response Example**
        
        - 파일이 다운로드 됩니다.
        
    3. 디렉토리 생성
        - EndPoint: [POST] /file/directory
        - Description:  지정한 경로에 directory를 생성합니다.
        
        **Request Example**
        
        ```jsx
        //Request Header Parameter
        {
        	"x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OThkZGI2MzIyYWMxMDExZTA"
        }
        
        //Requset Parameters
        {
        	"userId" : 7,
        	"path" : "pics/me", //me 라는 이름의 directory 생성
        	"dirName" : "newDirectory"
        }
        ```
        
        **Response Example**
        
        - 성공시
        
        ```jsx
        {
        	"success": true,
        	"message": "디렉토리가 성공적으로 생성되었습니다.",
        	"error": null,
        }
        ```
        
        - 실패시
        
        ```jsx
        {
        	"success": null,
        	"message": "디렉토리 생성에 실패하였습니다.",
        	"error": true,
        }
        ```
        
    4. 파일 / 디렉토리 삭제
        - EndPoint: [delete] /file/{path}
        - Description:  경로에 해당하는 디렉토리 혹은 파일을 삭제합니다.
        
        **Request Example**
        
        ```jsx
        //Request Header Parameter
        {
        	"x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OThkZGI2MzIyYWMxMDExZTA"
        }
        
        //Router Parameters
        {
        	"path": "FserjlWE" // {encodedPath} with base62
        }
        
        //Query Parameter
        {
        	"userId": 7
        }
        ```
        
        **Response Example**
        
        - 성공시
        
        ```jsx
        {
        	"success": true,
        	"message": "디렉토리가 성공적으로 삭제되었습니다.",
        	"error": null,
        }
        ```
        
        - 실패시
        
        ```jsx
        {
        	"success": null,
        	"message": "디렉토리 생성에 실패하였습니다.",
        	"error": true,
        }
        ```
        
    5. 파일 / 폴더명 변경
        - EndPoint: [patch] /file
        - Description:  경로에 해당하는 디렉토리 혹은 파일의 이름을 변경합니다..
        
        **Request Example**
        
        ```jsx
        //Request Header Parameter
        {
        	"x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OThkZGI2MzIyYWMxMDExZTA"
        }
        
        //Requset Parameters
        {
        	"userId": 7,
        	"path" : "pics/me",
        	"newFilename" : "hello"
        }
        ```
        
        **Response Example**
        
        - 성공시
        
        ```jsx
        {
        	"success": true,
        	"message": "해당 파일 / 폴더 명이 변경되었습니다.",
        	"error": null,
        }
        ```
        
        - 실패시
        
        ```jsx
        {
        	"success": null,
        	"message": "파일 /폴더명 변경에 실패하였습니다.",
        	"error": true,
        }
        ```
        
    6. 이미지 프리뷰 다운로드
        - EndPoint: [get] /file/img-preview
        - Description:  이미지 프리뷰를 띄우기 위해 압축된 이미지의 파일명을 반환합니다.
        
        **Request Example**
        
        ```jsx
        //Request Header Parameter
        {
        	"x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OThkZGI2MzIyYWMxMDExZTA"
        }
        
        //Requset Parameters
        {
        	"path" : "pics/me.png",
        }
        ```
        
        **Response Example**
        
        - 성공시
        
        ```jsx
        {
        	"success": true,
        	"message": "",
        	"link" : "extracted-me.png" //static folder내 저장된 파일명
        	"error": null,
        }
        ```
        
        - 실패시
        
        ```jsx
        {
        	"success": null,
        	"message": "",
        	"error": true,
        }
        ```
        

---

</div>
</details>

<details>
<summary>TAKE OUT</summary>
<div markdown="1">

- takeout
    
    
    |  | 메서드 | 엔드포인트 | 구현  여부 |
    | --- | --- | --- | --- |
    | addTakeOutRequest | POST | /takeout | o |
    |-  | - | - | - |
    1. addTakeOutRequest
        - EndPoint: [POST] /takeout
        - Description: 유저의 테이크 아웃 요청을 큐에 등록합니다.
        
        **Request Example**
        
        ```jsx
        //Request Parameter
        {
        	"userId" : 1,
        	"capacity" : 2
        }
        //Request Header
        {
        	"x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OThkZGI2MzIyYWMxMDExZTA"
        }
        ```
        
        **Response Example**
        
        ```jsx
        {
        	"success": true,
        	"message": "takeout이 신청되었습니다.",
        }
        ```
        
        ```jsx
        {
        	"success": false,
        	"message": "takeout이 실패하였습니다",
        }
        ```
</div>
</details>
