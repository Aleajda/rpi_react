import swaggerJSDoc from 'swagger-jsdoc';

const port = process.env.PORT || 5000;

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'RPI React API',
    version: '1.0.0',
  },
  servers: [{ url: `http://localhost:${port}` }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'Alex' },
          avatar: { type: ['string', 'null'], example: '/static/avatar.png' },
          isPro: { type: 'boolean', example: false },
          email: { type: 'string', example: 'test@mail.com' },
        },
      },
      AuthUser: {
        allOf: [
          { $ref: '#/components/schemas/User' },
          {
            type: 'object',
            properties: { accessToken: { type: 'string' } },
            required: ['accessToken'],
          },
        ],
      },
      Offer: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '10' },
          title: { type: 'string' },
          description: { type: 'string' },
          publishDate: { type: 'string', format: 'date-time' },
          city: {
            type: 'string',
            enum: ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'],
          },
          previewImage: { type: 'string', example: '/static/preview.png' },
          photos: { type: 'array', items: { type: 'string' } },
          isPremium: { type: 'boolean' },
          isFavorite: { type: 'boolean' },
          rating: { type: 'number', example: 4.2 },
          type: { type: 'string', enum: ['apartment', 'house', 'room', 'hotel'] },
          rooms: { type: 'integer', example: 2 },
          guests: { type: 'integer', example: 3 },
          price: { type: 'integer', example: 1200 },
          features: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'],
            },
          },
          commentsCount: { type: 'integer', example: 0 },
          latitude: { type: 'number', example: 48.8566 },
          longitude: { type: 'number', example: 2.3522 },
        },
      },
      Review: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '5' },
          comment: { type: 'string', example: 'Отлично!' },
          rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
          date: { type: 'string', format: 'date-time' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '1' },
              name: { type: 'string', example: 'Alex' },
              avatar: { type: ['string', 'null'], example: '/static/avatar.png' },
              isPro: { type: 'boolean', example: false },
            },
          },
        },
      },
      ApiError: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },
    },
  },
  tags: [
    { name: 'Auth' },
    { name: 'Offers' },
    { name: 'Reviews' },
    { name: 'Favorite' },
  ],
  paths: {
    '/registration': {
      post: {
        tags: ['Auth'],
        summary: 'Регистрация',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'username'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                  username: { type: 'string' },
                  userType: { type: 'string', enum: ['normal', 'pro'] },
                  avatar: { type: 'string', format: 'binary' },
                  avatarBase64: { type: 'string', description: 'Fallback совместимость' },
                },
              },
            },
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'username'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                  username: { type: 'string' },
                  userType: { type: 'string', enum: ['normal', 'pro'] },
                  avatarBase64: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Создано', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          400: { description: 'Ошибка', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        },
      },
    },
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Логин',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Ок', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthUser' } } } },
          400: { description: 'Ошибка', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        },
      },
      get: {
        tags: ['Auth'],
        summary: 'Проверка авторизации (возвращает пользователя + новый токен)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Ок', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthUser' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/logout': {
      delete: {
        tags: ['Auth'],
        summary: 'Logout',
        responses: { 204: { description: 'No Content' } },
      },
    },
    '/offers': {
      get: {
        tags: ['Offers'],
        summary: 'Список офферов',
        responses: {
          200: { description: 'Ок', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Offer' } } } } },
        },
      },
      post: {
        tags: ['Offers'],
        summary: 'Создать оффер (multipart)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'city', 'isPremium', 'isFavorite', 'rating', 'type', 'rooms', 'guests', 'price', 'features', 'latitude', 'longitude', 'previewImage'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  publishDate: { type: 'string', format: 'date-time' },
                  city: { type: 'string' },
                  isPremium: { type: 'string', description: 'true/false или 1/0' },
                  isFavorite: { type: 'string', description: 'true/false или 1/0' },
                  rating: { type: 'string' },
                  type: { type: 'string' },
                  rooms: { type: 'string' },
                  guests: { type: 'string' },
                  price: { type: 'string' },
                  features: { type: 'string', description: 'JSON string или строка через запятую' },
                  commentsCount: { type: 'string' },
                  latitude: { type: 'string' },
                  longitude: { type: 'string' },
                  userId: { type: 'string', description: 'Fallback, если нет JWT (обычно не нужен)' },
                  previewImage: { type: 'string', format: 'binary' },
                  photos: { type: 'array', items: { type: 'string', format: 'binary' } },
                  previewImageBase64: { type: 'string', description: 'Fallback совместимость' },
                  photosBase64: { type: 'array', items: { type: 'string' }, description: 'Fallback совместимость' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Создано', content: { 'application/json': { schema: { $ref: '#/components/schemas/Offer' } } } },
          400: { description: 'Ошибка', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/offers/{id}': {
      get: {
        tags: ['Offers'],
        summary: 'Полный оффер',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Ок', content: { 'application/json': { schema: { $ref: '#/components/schemas/Offer' } } } },
          400: { description: 'Не найден', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        },
      },
    },
    '/offers/favorite': {
      get: {
        tags: ['Favorite'],
        summary: 'Список избранного',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Ок', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Offer' } } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/offers/favorite/{offerId}/{status}': {
      post: {
        tags: ['Favorite'],
        summary: 'Переключить избранное',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'offerId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'status', in: 'path', required: true, schema: { type: 'string', description: '1/0 или true/false' } },
        ],
        responses: {
          200: { description: 'Ок', content: { 'application/json': { schema: { $ref: '#/components/schemas/Offer' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/favorite': {
      get: {
        tags: ['Favorite'],
        summary: 'Список избранного (alias)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Ок', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Offer' } } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/favorite/{offerId}/{status}': {
      post: {
        tags: ['Favorite'],
        summary: 'Переключить избранное (alias)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'offerId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'status', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Ок' }, 401: { description: 'Unauthorized' } },
      },
    },
    '/comments/{offerId}': {
      get: {
        tags: ['Reviews'],
        summary: 'Отзывы по offerId',
        parameters: [{ name: 'offerId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Ок', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Review' } } } } },
          400: { description: 'Не найдено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        },
      },
      post: {
        tags: ['Reviews'],
        summary: 'Добавить отзыв (offerId в path)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'offerId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['comment', 'rating'],
                properties: { comment: { type: 'string' }, rating: { type: 'integer', minimum: 1, maximum: 5 } },
              },
            },
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['comment', 'rating'],
                properties: { comment: { type: 'string' }, rating: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          201: { description: 'Создано', content: { 'application/json': { schema: { $ref: '#/components/schemas/Review' } } } },
          400: { description: 'Ошибка', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/comments': {
      post: {
        tags: ['Reviews'],
        summary: 'Добавить отзыв (offerId в body)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['offerId', 'comment', 'rating'],
                properties: {
                  offerId: { type: 'string' },
                  comment: { type: 'string' },
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                },
              },
            },
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['offerId', 'comment', 'rating'],
                properties: { offerId: { type: 'string' }, comment: { type: 'string' }, rating: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          201: { description: 'Создано', content: { 'application/json': { schema: { $ref: '#/components/schemas/Review' } } } },
          400: { description: 'Ошибка', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);

