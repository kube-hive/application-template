FROM quay.io/hummingbird/nodejs:24-builder as builder

WORKDIR /app

USER root

COPY . .

RUN npm install
RUN npm run build

FROM quay.io/hummingbird/nodejs:24

WORKDIR /app

COPY --from=builder /app/build /app

CMD ["/app/index.js"]
