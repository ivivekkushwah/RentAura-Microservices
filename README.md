# RentAura

A modern full-stack rental accommodation platform built with microservices architecture for students, tenants, and property owners.

RentAura allows users to browse rooms, book properties, manage rentals, and interact with property owners through a scalable and secure system.

---

# Features

## User Features

* User authentication with JWT
* Secure login & registration
* Browse rooms & properties
* Room booking system
* User dashboard
* Booking history
* Profile management
* Account settings
* Dark mode support
* Responsive UI

---

## Owner Features

* Owner dashboard
* Add properties
* Add/manage rooms
* View bookings
* Tenant management
* Owner profile
* Owner settings
* Property statistics
* Booking analytics

---

## Backend Features

* Spring Boot microservices
* API Gateway
* Eureka Service Registry
* JWT Authentication
* Role-based authorization
* REST APIs
* MySQL database integration
* Feign Client communication
* Cloudinary image upload

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Framer Motion
* Axios
* React Hooks
* Sonner Toast

---

## Backend

* Java
* Spring Boot
* Spring Security
* Spring Cloud Gateway
* Spring Cloud Eureka
* Spring Data JPA
* Hibernate
* MySQL
* JWT
* Maven

---

# Project Architecture

```text
RentAura/
 ├── frontend/
 ├── auth-service/
 ├── booking-service/
 ├── property-service/
 ├── api-gateway/
 └── service-registry/
```

---

# Microservices

## Auth Service

Handles:

* Authentication
* Registration
* JWT token generation
* User profiles
* User settings
* Owner settings
* Role management

---

## Property Service

Handles:

* Properties
* Rooms
* Property images
* Room management
* Owner property operations

---

## Booking Service

Handles:

* Room bookings
* Booking approval/rejection
* Tenant booking management
* Booking history

---

## API Gateway

Handles:

* Routing
* Authentication filtering
* Request forwarding
* Centralized API access

---

## Service Registry

Handles:

* Eureka server
* Service discovery
* Microservice registration

---

# Screenshots

## User Dashboard

* Booking overview
* Rent payments
* Lease information
* Notifications

---

## Owner Dashboard

* Property statistics
* Room analytics
* Booking management
* Tenant management

---

# Authentication Flow

1. User logs in
2. JWT token generated
3. Token stored in cookies
4. API Gateway validates requests
5. User data forwarded to microservices

---

# Database

Separate databases are used for services:

* rentaura_auth
* rentaura_property
* rentaura_booking

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/rentaura-backend.git
```

---

# Backend Setup

## Start Eureka Server

```bash
cd service-registry
mvn spring-boot:run
```

---

## Start API Gateway

```bash
cd api-gateway
mvn spring-boot:run
```

---

## Start Auth Service

```bash
cd auth-service
mvn spring-boot:run
```

---

## Start Property Service

```bash
cd property-service
mvn spring-boot:run
```

---

## Start Booking Service

```bash
cd booking-service
mvn spring-boot:run
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

## Frontend

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

## Backend

Configure:

```properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
JWT_SECRET=
```

---

# API Highlights

## Authentication APIs

* Register user
* Login user
* Get current user
* Update profile
* Update settings

---

## Property APIs

* Add property
* Get owner properties
* Add room
* Get rooms by property
* Upload property images

---

## Booking APIs

* Book room
* Get bookings
* Approve bookings
* Reject bookings
* Tenant booking history

---

# Security

* JWT Authentication
* Route protection
* Secure cookie handling
* Role-based authorization
* API Gateway filtering

---

# Future Improvements

* Real-time chat system
* Payment integration
* AI roommate matching
* Notifications system
* Review & rating system
* Google Maps integration
* Advanced analytics

---

# Learning Outcomes

This project helped in learning:

* Microservices architecture
* Full-stack development
* Authentication systems
* API Gateway architecture
* Service discovery
* REST API design
* Role-based access control
* Modern UI development

---

# Author

## Vivek Kushwaha

Full Stack Developer

* Java
* Spring Boot
* React
* Next.js
* Microservices

---

# License

This project is developed for learning, portfolio, and placement purposes.
