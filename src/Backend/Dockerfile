FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
RUN set -e; \
    for attempt in 1 2 3 4; do \
      if mvn -B -ntp dependency:go-offline; then \
        break; \
      fi; \
      echo "Maven dependency:go-offline failed (attempt $attempt), waiting..."; \
      sleep $((attempt * 10)); \
    done

COPY src ./src
RUN set -e; \
    for attempt in 1 2 3 4; do \
      if mvn -B -ntp clean package -DskipTests; then \
        break; \
      fi; \
      echo "Maven package failed (attempt $attempt), waiting..."; \
      sleep $((attempt * 10)); \
    done

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]