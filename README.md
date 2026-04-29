# Mini E-Commerce Portal

A simple e-commerce application built with Golang (Backend) and React (Frontend).

## Features

* View a list of products
* Add/remove items from a shopping cart
* Proceed to a mocked checkout process

## Technology Stack

* **Frontend:** React, React Router DOM, React Context API, Webpack (manual setup), Express (Node.js) server, Docker
* **Backend:** Golang, standard `net/http` library, in-memory data store

---

## Getting Started

### Prerequisites

* [Go](https://golang.org/doc/install) (1.21 or newer)
* [Node.js & npm](https://nodejs.org/en/download/) (18.x or newer)
* [Docker](https://docs.docker.com/get-docker/) (optional, for containerized frontend)

---

### 1. Running the Go Backend

The backend is a standard Go HTTP server that provides the REST API.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start the server:
   ```bash
   go run main.go
   ```
The server will start on `http://localhost:8080`.

#### API Contract

* **`GET /products`**: Returns a list of all available products.
* **`GET /cart`**: Returns the current state of the user's shopping cart.
* **`POST /cart`**: Adds an item to the cart.
  * Request Body: `{"productId": "string", "quantity": int}`
* **`POST /checkout`**: Mocks a checkout process, clears the cart, and returns an order ID.
  * Request Body: `{"paymentMethod": "string"}`

---

### 2. Running the React Frontend (Development Mode)

During development, we use Webpack Dev Server to provide hot-reloading and proxy API requests.

1. Open a *new* terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
The frontend will open in your browser at `http://localhost:3000`. API requests are proxied to `localhost:8080`.

---

### 3. Running the Frontend for Production (Docker)

To run the frontend exactly as it would be deployed in a production environment, we use a Multi-Stage Docker build. This compiles the React app into static files and serves them using a lightweight Node.js/Express server.

1. Ensure your Go backend is running on `localhost:8080`.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Build the Docker image:
   ```bash
   docker build -t react-go-frontend .
   ```
4. Run the Docker container (using `--network host` to allow the container to communicate with the local Go backend):
   ```bash
   docker run -p 3000:3000 --network host react-go-frontend
   ```

You can now access the production-ready application at `http://localhost:3000`.

---

## Project Structure

* `/backend`: Golang API server, models, and in-memory store.
* `/frontend`: React application, Webpack configuration, Express server (`server.js`), and Dockerfile.
