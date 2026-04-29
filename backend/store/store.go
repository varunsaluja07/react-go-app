package store

import (
	"errors"
	"react-go-app/backend/models"
	"sync"
)

// Store represents an in-memory database for our application.
// In Go, it's common to use structs to hold state, similar to a class in Java.
type Store struct {
	mu       sync.RWMutex
	products map[string]models.Product
	cart     map[string]int // maps productID to quantity
}

// NewStore acts like a constructor, creating and initializing our Store.
func NewStore() *Store {
	s := &Store{
		products: make(map[string]models.Product),
		cart:     make(map[string]int),
	}
	s.seedProducts()
	return s
}

func (s *Store) seedProducts() {
	prods := []models.Product{
		{ID: "p1", Name: "Laptop", Description: "A high performance laptop", Price: 999.99, ImageURL: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=300&h=200&fit=crop"},
		{ID: "p2", Name: "Mouse", Description: "Wireless mouse", Price: 25.50, ImageURL: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=300&h=200&fit=crop"},
		{ID: "p3", Name: "Keyboard", Description: "Mechanical keyboard", Price: 75.00, ImageURL: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=300&h=200&fit=crop"},
		{ID: "p4", Name: "Headphones", Description: "Noise-cancelling over-ear headphones", Price: 199.99, ImageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&h=200&fit=crop"},
		{ID: "p5", Name: "Monitor", Description: "27-inch 4K UHD Display", Price: 349.50, ImageURL: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=300&h=200&fit=crop"},
		{ID: "p6", Name: "Desk Pad", Description: "Extended leather desk mat", Price: 35.00, ImageURL: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=300&h=200&fit=crop"},
	}
	for _, p := range prods {
		s.products[p.ID] = p
	}
}

func (s *Store) GetProducts() []models.Product {
	// We use read-locks to allow concurrent reads but block writes
	s.mu.RLock()
	defer s.mu.RUnlock()

	res := make([]models.Product, 0, len(s.products))
	for _, p := range s.products {
		res = append(res, p)
	}
	return res
}

func (s *Store) GetCart() models.Cart {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var items []models.CartItem
	for id, qty := range s.cart {
		items = append(items, models.CartItem{ProductID: id, Quantity: qty})
	}
	return models.Cart{Items: items}
}

func (s *Store) AddToCart(productID string, quantity int) error {
	// We use a full lock here because we are modifying state
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.products[productID]; !exists {
		return errors.New("product not found")
	}

	s.cart[productID] += quantity
	if s.cart[productID] <= 0 {
		delete(s.cart, productID) // remove item if quantity drops to 0
	}
	return nil
}

func (s *Store) ClearCart() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.cart = make(map[string]int)
}
