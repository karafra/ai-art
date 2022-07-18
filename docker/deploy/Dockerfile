FROM ghcr.io/karafra/ai-art:latest

# Environmnet vairables runtime configuration
ARG DISCORD_TOKEN
ENV TOKEN="$DISCORD_TOKEN"

ENV AMQP_URL="amqp://guest:guest@rabbitmq:5672"

ENV SENTRY_DSN="https://fecb41917abe418f8aff855ea674fddf@o970705.ingest.sentry.io/6501050"

ARG OPEN_AI_TOKEN
ENV OPEN_API_TOKEN="$OPEN_AI_TOKEN"
