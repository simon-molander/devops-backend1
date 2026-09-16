# Pensionat Backend 2

Det här projektet bygger vidare på pensionatet från Backend 1 och delar upp systemet från en monolit till flera microservices.

Projektet innehåller även en separat React-frontend och är tänkt att kunna köras både lokalt med Docker Compose och deployas externt med Railway. Kubernetes-konfiguration finns också med i projektet.

## Översikt

Systemet består av tre backend-tjänster samt en separat frontend:

- **Booking Service** – ansvarar för rum och bokningar.
- **Customer Service** – ansvarar för all kundhantering.
- **Review Service** – ansvarar för recensioner.
- **React Frontend** – användargränssnittet som anropar backend-tjänsternas REST-API:er.

Tjänsterna har separata ansvarsområden och kommunicerar med varandra via REST-anrop.

```text
Customer Service :8081
        |
        | REST
        v
Booking Service :8080
        ^
        |
        | REST
        |
Review Service
```

## Booking Service

Booking Service är den tidigare Backend 1-applikationen som har byggts vidare.

Den ansvarar för:

- skapa bokningar
- hämta bokningar
- uppdatera bokningar
- ta bort bokningar
- hantera rum
- kontrollera dubbelbokningar
- kontrollera om en kund har aktiva bokningar

En bokning sparar inte längre hela kunden. Den sparar bara kundens `customerId`.

Exempel på en bokning:

```json
{
  "customerId": 2,
  "roomId": 1,
  "checkInDate": "2026-09-10",
  "checkOutDate": "2026-09-15",
  "numberOfGuests": 1
}
```

### Exempel på endpoints

```text
GET    /api/bookings
GET    /api/bookings/{id}
POST   /api/bookings
PUT    /api/bookings/{id}
DELETE /api/bookings/{id}

GET    /api/bookings/customer/{customerId}/active
```

Den sista endpointen används av Customer Service för att kontrollera om en kund har aktiva bokningar.

## Customer Service

Customer Service är en separat Spring Boot-applikation.

Den ansvarar för:

- registrera kunder
- hämta kunder
- uppdatera kunduppgifter
- ta bort kunder
- validera kunddata
- kontrollera att en kund inte tas bort om kunden har aktiva bokningar

### Exempel på endpoints

```text
GET    /api/customers
GET    /api/customers/{id}
POST   /api/customers
PUT    /api/customers/{id}
DELETE /api/customers/{id}
```

Customer Service kör lokalt på port:

```text
8081
```

Booking Service kör lokalt på port:

```text
8080
```

## Review Service

Review Service är systemets tredje microservice och ansvarar för recensioner.

Tjänsten har egen Spring Boot-applikation, egen databas och egna lager för controller, service och repository.

En recension innehåller:

```text
id
customerId
roomId
reviewText
reviewDate
```

Review Service sparar endast `customerId` och `roomId`. Kund- och rumsdata hämtas inte direkt från de andra tjänsternas databaser.

### Review-endpoints

```text
GET    /api/reviews
GET    /api/reviews/customer/{customerId}
GET    /api/reviews/room/{roomId}
POST   /api/reviews
PUT    /api/reviews/edit/{id}
DELETE /api/reviews/{id}
```

### Skapa recension

När en recension skapas tar API:t emot exempelvis:

```json
{
  "customerId": 2,
  "roomId": 1,
  "reviewText": "Bra rum och trevligt bemötande",
  "reviewDate": "2026-09-09"
}
```

Innan recensionen sparas använder Review Service sina REST-klienter för att kontrollera att:

- rummet finns i Booking Service
- kunden finns i Customer Service

Flödet ser förenklat ut så här:

```text
POST /api/reviews
      |
      v
ReviewController
      |
      v
ReviewService
      |
      +----> BookingClient ----REST----> Booking Service
      |
      +----> CustomerClient ---REST----> Customer Service
      |
      v
ReviewRepository
      |
      v
Review database
```

Om kund eller rum inte finns stoppas skapandet med ett tydligt fel.

### Felhantering i Review Service

Review Service använder en `GlobalExceptionHandler`.

Följande fel hanteras:

```text
ReviewNotFoundException               -> 404 Not Found
InvalidReviewDataException            -> 400 Bad Request
CustomerServiceUnavailableException   -> 503 Service Unavailable
BookingServiceUnavailable             -> 503 Service Unavailable
```

Det gör att REST-API:t kan ge tydliga statuskoder istället för generiska serverfel.

## React Frontend

Projektet har även en separat frontend byggd i React.

Frontend ligger i mappen:

```text
frontend/
```

React-applikationen används som användargränssnitt och anropar backend-tjänsternas REST-endpoints via HTTP.

Frontend är separerad från backend-koden, vilket gör att backend-tjänsterna endast behöver returnera data som JSON.

Exempel på kommunikation:

```text
React Frontend
      |
      | HTTP / REST
      v
Booking Service

React Frontend
      |
      | HTTP / REST
      v
Customer Service

React Frontend
      |
      | HTTP / REST
      v
Review Service
```

## Kommunikation mellan tjänsterna

Tjänsterna får inte läsa eller skriva direkt i varandras databaser.

Kommunikationen sker istället via REST.

### Exempel: ta bort kund

När en kund ska tas bort sker följande:

```text
DELETE /api/customers/2
        |
        v
CustomerController
        |
        v
CustomerService
        |
        v
BookingClient
        |
        | GET /api/bookings/customer/2/active
        v
Booking Service
        |
        v
true / false
```

Om Booking Service svarar `true` betyder det att kunden har en aktiv bokning.

Customer Service stoppar då borttagningen och svarar med:

```text
409 Conflict
```

Om Booking Service svarar `false` får kunden tas bort.

## Databaser

Varje tjänst använder sin egen databas.

```text
Booking Service
    |
    v
Booking database
    - booking
    - rooms
```

```text
Customer Service
    |
    v
Customer database
    - customer
```

```text
Review Service
    |
    v
Review database
    - reviews
```

Tjänsterna får aldrig använda varandras repositories eller databastabeller direkt.

## Felhantering

API:erna använder HTTP-statuskoder för att beskriva resultatet av ett anrop.

Exempel:

```text
200 OK            - anropet lyckades
201 Created       - en resurs skapades
204 No Content    - borttagning lyckades
400 Bad Request   - ogiltig input
404 Not Found     - resursen finns inte
409 Conflict      - till exempel aktiv bokning eller email som redan används
```

Customer Service har en `GlobalExceptionHandler` som omvandlar exceptions till rätt HTTP-status.

Exempel på exceptions:

```text
CustomerNotFoundException
EmailInUseException
CustomerHasActiveBookingException
InvalidCustomerDataException
```

## Testat flöde

Följande flöde har testats manuellt i Thunder Client:

1. En kund skapades i Customer Service.
2. Ett rum fanns i Booking Service.
3. En bokning skapades med kundens `customerId`.
4. Booking Service kontrollerades med:

```text
GET /api/bookings/customer/{customerId}/active
```

5. Endpointen returnerade `true`.
6. Ett försök gjordes att radera kunden.
7. Customer Service frågade Booking Service via REST.
8. Kunden hade en aktiv bokning.
9. Customer Service svarade med `409 Conflict`.
10. Kunden raderades inte.

## Projektstruktur

Projektet är uppdelat i flera separata delar.

### Booking Service

Booking Service ligger under Java-backend-projektet och innehåller bland annat:

```text
org.example.javabackend1/
├── Booking/
│   ├── BookingController
│   ├── BookingCreateDTO
│   ├── BookingEntity
│   ├── BookingRepository
│   ├── BookingResponseDTO
│   └── BookingService
│
├── Room/
│   ├── RoomController
│   ├── RoomCreateDTO
│   ├── RoomEntity
│   ├── RoomRepository
│   ├── RoomResponseDTO
│   ├── RoomService
│   └── RoomType
│
├── Exceptions/
│   ├── BookingDatesInvalid
│   ├── BookingNotFoundException
│   ├── CustomerNotFoundException
│   ├── CustomerServiceUnavailableException
│   ├── InvalidRoomDataException
│   ├── RoomDatesInvalidException
│   ├── RoomIsBookedException
│   └── RoomNotFoundException
│
├── CustomerServiceClient
├── GlobalExceptionHandler
└── JavaBackend1Application
```

### Customer Service

Customer Service ligger i ett separat Spring Boot-projekt.

```text
CustomerService/
├── client/
│   └── BookingClient
│
├── Exceptions/
│   ├── CustomerHasActiveBookingException
│   ├── CustomerNotFoundException
│   ├── EmailInUseException
│   └── InvalidCustomerDataException
│
├── CustomerController
├── CustomerCreateDTO
├── CustomerEntity
├── CustomerRepository
├── CustomerResponseDTO
├── CustomerService
├── CustomerServiceApplication
└── GlobalExceptionHandler
```

### Review Service

Review Service ligger i ett separat Spring Boot-projekt.

```text
org.example.reviewservice/
├── Client/
│   ├── BookingClient
│   └── CustomerClient
│
├── Exceptions/
│   ├── BookingServiceUnavailable
│   ├── CustomerServiceUnavailableException
│   ├── InvalidReviewDataException
│   └── ReviewNotFoundException
│
├── GlobalExceptionHandler
├── ReviewController
├── ReviewCreateDTO
├── ReviewEntity
├── ReviewRepository
├── ReviewResponseDTO
├── ReviewService
└── ReviewServiceApplication
```

### Frontend

```text
frontend/
└── React application
```

### Övrig infrastruktur

Projektet innehåller även konfiguration för:

```text
Dockerfile
docker-compose.yml
k8s/
```

## Starta projektet lokalt

Under utveckling kan tjänsterna startas separat i IntelliJ.

1. Starta databaserna.
2. Starta Booking Service på port `8080`.
3. Starta Customer Service på port `8081`.
4. Testa API:erna i Thunder Client eller Postman.

## Docker

Varje backend-tjänst kan byggas som en Docker-container.

Projektet innehåller `Dockerfile` och en `docker-compose.yml` för att kunna starta flera delar tillsammans.

Målet är att hela systemet ska kunna startas med:

```bash
docker compose up
```

Docker Compose ska kunna starta:

- Booking Service
- Customer Service
- Review Service
- databaserna som tjänsterna använder
- övriga beroenden som behövs för lokal körning

Det gör att tjänsterna kan köras i en mer produktionslik miljö utan att alla delar behöver startas manuellt i IntelliJ.

## Railway

Projektet använder Railway för deployment.

Railway används för att köra tjänsterna externt istället för endast på den lokala datorn.

Vid deployment behöver tjänsterna använda rätt externa URL:er när de kommunicerar med varandra. Lokala adresser som:

```text
http://localhost:8080
```

fungerar endast lokalt och behöver därför ersättas med tjänsternas Railway-adresser eller miljövariabler i deployad miljö.

## Kubernetes

Projektet innehåller även Kubernetes-konfiguration i en `k8s`-mapp.

Kubernetes används för att beskriva hur tjänster och databaser kan köras som containers i ett kluster.

Exempel på resurser som kan finnas där är:

```text
Deployment
Service
database configuration
environment variables
```

Syftet är att varje microservice ska kunna köras separat men ändå kommunicera med de andra tjänsterna över nätverket.

## Integrationstester

Booking Service innehåller integrationstester för Room-API:t med `@SpringBootTest` och `RestTestClient`.

De tester som finns just nu är:

### Skapa rum

```text
POST /api/rooms
-> förväntar 201 Created
-> kontrollerar att rummet verkligen sparades i databasen
```

### Ogiltigt rum

```text
POST /api/rooms
SINGLE + extra bed
-> förväntar 400 Bad Request
```

### Ta bort rum

```text
DELETE /api/rooms/{id}
-> förväntar 204 No Content
-> kontrollerar att rummet inte längre finns i databasen
```

Tester kör riktiga HTTP-anrop mot applikationen med en slumpmässig port och verifierar även resultatet i repositoryt.

## Kvar att göra

Exakt vad som återstår beror på hur långt varje del har kommit, men viktiga saker att verifiera innan inlämning är:

- att alla tre tjänster startar korrekt
- att REST-kommunikationen fungerar mellan tjänsterna
- att felhantering fungerar när en annan tjänst är nere
- att React-frontenden fungerar mot backend-tjänsterna
- att Docker Compose startar hela systemet
- att Railway-deploymenten fungerar
- att Kubernetes-konfigurationen fungerar
- att integrationstesterna går igenom

## Teknik

Projektet använder bland annat:

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Jakarta Validation
- REST
- MySQL
- React
- Docker
- Docker Compose
- Kubernetes
- Railway
- Maven
- JUnit
- RestTestClient
- Thunder Client/Postman
- IntelliJ IDEA
