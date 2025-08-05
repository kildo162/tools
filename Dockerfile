# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod ./
RUN go mod tidy

# Copy source code
COPY dist/ ./dist/
COPY main.go ./

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Production stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Copy dist directory for static files
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./main"]