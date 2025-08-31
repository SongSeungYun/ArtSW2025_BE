# 1. Node.js 18 기반 이미지 사용
FROM node:18-alpine

# 2. 작업 디렉토리 생성
WORKDIR /app

# 3. package.json, package-lock.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install  # <-- devDependencies 포함 설치

# 4. 앱 소스 코드 복사
COPY . .

# 5. NestJS 빌드
RUN npx nest build  # <-- npx로 실행하면 글로벌 CLI 필요 없음

# 6. 컨테이너 실행 시 Node로 빌드된 앱 실행
CMD ["node", "dist/main.js"]

# 7. 필요 시 포트 노출
EXPOSE 3000