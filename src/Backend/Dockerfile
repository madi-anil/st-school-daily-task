FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn -B -ntp dependency:go-offline \
    -Daether.connector.basic.maxRetryAttempts=5 \
    -Daether.connector.basic.retryInterval=3000

COPY src ./src
RUN mvn -B -ntp clean package -DskipTests \
    -Daether.connector.basic.maxRetryAttempts=5 \
    -Daether.connector.basic.retryInterval=3000

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]