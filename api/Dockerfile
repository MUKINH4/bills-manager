FROM gradle:jdk17-alpine AS build

WORKDIR /app

COPY . .

RUN ./gradlew clean -x test --no-daemon build

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD [ "java", "-jar", "app.jar" ]