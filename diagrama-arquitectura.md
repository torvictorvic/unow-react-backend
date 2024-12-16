graph LR
    subgraph Frontend
        React[React.js Frontend]
    end

    subgraph Backend
        Symfony[Symfony PHP Backend]
        FastAPI[FastAPI Python Email Service]
    end

    subgraph Base de Datos
        MySQL[MySQL Database]
    end

    subgraph Servicios Externos
        EmailService[Servicio de Envío de Correos]
    end

    React -->|HTTP Requests| Symfony
    React -->|HTTP Requests| FastAPI
    Symfony -->|ORM| MySQL
    FastAPI -->|SMTP| EmailService