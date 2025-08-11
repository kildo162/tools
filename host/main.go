package main

import (
	"log"
	"net/http"
)

func main() {
	// Serve static files from dist directory
	distDir := "./ui"

	// Create file server for dist directory
	fs := http.FileServer(http.Dir(distDir))

	// Handle all requests
	http.Handle("/", fs)

	// Start server on port 8083
	port := ":8083"
	log.Printf("Server starting on http://localhost%s", port)

	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
