ARG ELASTIC_VERSION

# https://www.docker.elastic.co/
FROM docker.elastic.co/elasticsearch/elasticsearch:${ELASTIC_VERSION}
COPY lib.sh ./lib.sh
ENTRYPOINT ["/entrypoint.sh"]