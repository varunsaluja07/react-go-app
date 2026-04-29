package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"react-go-app/backend/models"
	"react-go-app/backend/store"
)

// App holds our application state
type App struct {
	store *store.Store
}

func main() {
	// Initialize our in-memory store
	app := &App{
		store: store.NewStore(),
	}

	// Define our HTTP routes
	// In Java Spring, this is similar to @RequestMapping or @GetMapping
	http.HandleFunc("/products", app.getProductsHandler)
	http.HandleFunc("/cart", app.cartHandler)
	http.HandleFunc("/checkout", app.checkoutHandler)

	fmt.Println("Server is running on http://localhost:8080")
	// Start the server on port 8080
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// GET /products
func (a *App) getProductsHandler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS for local React development
	enableCORS(w)
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	products := a.store.GetProducts()
	
	// Convert our Go slice (array) to JSON and send it
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

// GET /cart or POST /cart
func (a *App) cartHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	
	// Handle CORS preflight request from browser
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case http.MethodGet:
		cart := a.store.GetCart()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(cart)

	case http.MethodPost:
		var item models.CartItem
		// Decode the incoming JSON body into our CartItem struct
		if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if err := a.store.AddToCart(item.ProductID, item.Quantity); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		
		// Respond with HTTP 201 Created
		w.WriteHeader(http.StatusCreated)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// POST /checkout
func (a *App) checkoutHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.CheckoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Mock checkout logic: just clear the cart and return a success response
	a.store.ClearCart()

	resp := models.CheckoutResponse{
		OrderID: "ORD-" + req.PaymentMethod + "-12345",
		Status:  "SUCCESS",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// Helper function to allow our local React app (usually on port 3000) to talk to this Go API (port 8080)
func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
