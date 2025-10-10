FROM gradle:jdk21-alpine AS build

WORKDIR /app

COPY . .

RUN ./gradlew clean -x test --no-daemon build

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

CMD [ "java", "-jar", "app.jar" ]