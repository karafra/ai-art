FROM ghcr.io/karafra/ai-art:latest

# Environmnet vairables runtime configuration
ARG DISCORD_TOKEN
ENV TOKEN="$DISCORD_TOKEN"

ENV AMQP_URL="amqp://guest:guest@rabbitmq:5672"

ARG DISCORD_BOTID
ENV BOTID="$DISCORD_BOTID"

ARG OPEN_AI_TOKEN
ENV OPEN_API_TOKEN="$OPEN_AI_TOKEN"
