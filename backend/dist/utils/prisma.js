"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is required");
}
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
exports.prisma = global.prisma || new client_1.PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") {
    global.prisma = exports.prisma;
}
exports.default = exports.prisma;
//# sourceMappingURL=prisma.js.map