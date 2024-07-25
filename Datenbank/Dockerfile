FROM postgres:latest

ENV POSTGRES_DB=pong_daten
ENV POSTGRES_USER=testuser
ENV POSTGRES_PASSWORD=SicheresPasswort!

COPY pong_daten_dump.sql /docker-entrypoint-initdb.d/