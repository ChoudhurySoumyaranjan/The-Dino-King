#  Build Spring Boot App
FROM maven:3.9.11-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests


# Run Spring Boot App
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/dino-king-backend.jar app.jar

EXPOSE 5005

ENTRYPOINT ["java", "-jar", "app.jar"]