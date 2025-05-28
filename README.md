app-cartao/               # Raiz do projeto
├── prisma/              # Arquivos do ORM Prisma
│   └── schema.prisma    # Esquema do banco de dados
│
├── public/              # Frontend estático servido pelo Express
│   ├── css/             # Arquivos CSS
│   ├── html/            # Páginas HTML principais
│   ├── js/              # Scripts JavaScript compartilhados
│   ├── landingPage/     # Páginas ou assets da landing page
│   ├── logo/            # Logo e imagens de marca
│   ├── manifest.json    # Web App Manifest
│   └── txt.txt          # (Exemplo de arquivo adicional)
│
├── src/                 # Código-fonte backend
│   ├── config/          # Configurações (por exemplo, conexão com DB)
│   ├── controllers/     # Controladores (lógica de rotas)
│   ├── middlewares/     # Middlewares Express
│   ├── routes/          # Definição de endpoints e roteamento
│   ├── services/        # Regras de negócio e serviços auxiliares
│   ├── server.js        # Ponto de entrada do servidor
│   └── txt.txt          # (Exemplo de arquivo adicional)
│
├── .env                 # Variáveis de ambiente
└── README.md            # Este arquivo de documentação