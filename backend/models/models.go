package models

type Product struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImageURL    string  `json:"imageUrl"`
}

type CartItem struct {
	ProductID string `json:"productId"`
	Quantity  int    `json:"quantity"`
}

type Cart struct {
	Items []CartItem `json:"items"`
}

type CheckoutRequest struct {
	PaymentMethod string `json:"paymentMethod"`
}

type CheckoutResponse struct {
	OrderID string `json:"orderId"`
	Status  string `json:"status"`
}
