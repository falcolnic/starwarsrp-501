export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "501st Backend API",
    version: "0.0.1",
    description: "Backend API for the 501st Legion site: auth, public content, and admin management.",
  },
  tags: [
    { name: "Health", description: "Service checks" },
    { name: "Auth", description: "Session login and current user" },
    { name: "Public", description: "Public content endpoints" },
    { name: "Admin", description: "Protected management endpoints" },
  ],
  components: {
    securitySchemes: {
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "session_id",
      },
    },
    schemas: {
      HealthResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: true },
        },
        required: ["ok"],
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
        required: ["error"],
      },
      LoginRequest: {
        type: "object",
        properties: {
          username: { type: "string", example: "admin" },
          password: { type: "string", example: "secret" },
        },
        required: ["username", "password"],
      },
      UserResponse: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          username: { type: "string", example: "admin" },
          displayName: { type: "string", example: "Commandant" },
          role: { type: "string", example: "superadmin" },
        },
        required: ["id", "username", "displayName", "role"],
      },
      Rank: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Рядовой" },
          order: { type: "integer", example: 1 },
          description: { type: "string", nullable: true },
        },
      },
      Document: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Устав ВАР" },
          description: { type: "string", nullable: true },
          url: { type: "string", example: "https://example.com/doc" },
          category: { type: "string", nullable: true },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        responses: {
          200: {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Logged in",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          400: { description: "Invalid input" },
          401: { description: "Wrong credentials" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        responses: {
          200: {
            description: "Logged out",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { ok: { type: "boolean", example: true } },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        security: [{ sessionCookie: [] }],
        responses: {
          200: {
            description: "Current user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          401: { description: "Not authenticated" },
        },
      },
    },
    "/api/ranks": {
      get: {
        tags: ["Public"],
        responses: {
          200: {
            description: "All ranks",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Rank" } },
              },
            },
          },
        },
      },
    },
    "/api/ranks/{id}/requirements": {
      get: {
        tags: ["Public"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Requirements for rank" },
          400: { description: "Invalid id" },
        },
      },
    },
    "/api/docs": {
      get: {
        tags: ["Public"],
        responses: {
          200: {
            description: "All documents",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Document" } },
              },
            },
          },
        },
      },
    },
    "/api/admin/ranks": {
      post: {
        tags: ["Admin"],
        security: [{ sessionCookie: [] }],
        responses: {
          201: { description: "Rank created" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/admin/users": {
      get: {
        tags: ["Admin"],
        security: [{ sessionCookie: [] }],
        responses: {
          200: { description: "All users" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
  },
} as const;
