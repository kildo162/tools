FROM golang:1.24-alpine AS builder
WORKDIR /app

# Copy go mod files
COPY go.mod ./
RUN go mod tidy

# Copy source code
COPY ui/ ./ui/
COPY main.go ./

# Nhận platform từ buildx
ARG TARGETOS
ARG TARGETARCH
ENV CGO_ENABLED=0

# Build đúng kiến trúc
RUN GOOS=$TARGETOS GOARCH=$TARGETARCH go build -trimpath -ldflags="-s -w" -o main .

# Production stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/ui ./ui
EXPOSE 8083
RUN ls -alh .
CMD ["./main"]
