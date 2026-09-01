# Gradle을 이용하여 빌드
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app

# 의존성 캐싱을 위한 Gradle 파일 먼저 복사
COPY gradle gradle
COPY gradlew build.gradle settings.gradle ./
RUN ./gradlew dependencies --no-daemon

# 소스코드 복사 및 빌드 (테스트x)
COPY src src
RUN ./gradlew bootJar --no-daemon -x test

# 실행 전용 경량화 환경
FROM openjdk:17-jdk-slim
WORKDIR /app

# 빌드된 jar 파일만 추출해서 복사
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]