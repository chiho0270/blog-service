import type { Post } from '../types/blog';

export const samplePosts: Post[] = [
  {
    id: '1',
    title: 'Building High-Performance REST APIs: Best Practices and Patterns',
    date: '2026-02-05',
    author: 'Alex Chen',
    tags: ['API Design', 'REST', 'Performance', 'Node.js'],
    overview: 'A comprehensive guide to designing and implementing REST APIs that scale. We\'ll cover versioning strategies, pagination patterns, rate limiting, and response optimization techniques that can handle millions of requests.',
    readTime: 12,
    series: 'API Design Mastery',
    body: `## Introduction

REST APIs are the backbone of modern web applications. In this post, we'll explore battle-tested patterns for building APIs that are not only functional but also performant and maintainable.

## Key Principles

### 1. Resource Naming Conventions

Use nouns, not verbs. Keep it consistent and predictable:

\`\`\`javascript
// Good
GET /api/v1/users
POST /api/v1/users
GET /api/v1/users/:id
PUT /api/v1/users/:id
DELETE /api/v1/users/:id

// Bad
GET /api/v1/getAllUsers
POST /api/v1/createUser
\`\`\`

### 2. Implement Pagination Early

Even if you think you don't need it, you will. Here's a cursor-based approach:

\`\`\`javascript
// Express.js example
app.get('/api/v1/users', async (req, res) => {
  const { cursor, limit = 20 } = req.query;
  
  const query = {
    limit: parseInt(limit) + 1, // Fetch one extra to check if there's more
  };
  
  if (cursor) {
    query.where = { id: { $gt: cursor } };
  }
  
  const users = await User.find(query).sort({ id: 1 });
  const hasMore = users.length > limit;
  
  if (hasMore) {
    users.pop(); // Remove the extra item
  }
  
  res.json({
    data: users,
    pagination: {
      nextCursor: hasMore ? users[users.length - 1].id : null,
      hasMore,
    },
  });
});
\`\`\`

### 3. Rate Limiting with Redis

Protect your API from abuse:

\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

async function rateLimiter(req, res, next) {
  const key = \`rate_limit:\${req.ip}\`;
  const limit = 100; // requests
  const window = 60; // seconds
  
  const current = await client.incr(key);
  
  if (current === 1) {
    await client.expire(key, window);
  }
  
  if (current > limit) {
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: await client.ttl(key),
    });
  }
  
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', limit - current);
  next();
}
\`\`\`

### 4. Response Compression

Enable GZIP compression to reduce payload size:

\`\`\`javascript
const compression = require('compression');

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Balance between speed and compression ratio
}));
\`\`\`

### 5. Field Selection (Sparse Fieldsets)

Allow clients to request only the fields they need:

\`\`\`javascript
app.get('/api/v1/users/:id', async (req, res) => {
  const { fields } = req.query;
  
  let select = {};
  if (fields) {
    // ?fields=name,email,createdAt
    fields.split(',').forEach(field => {
      select[field.trim()] = 1;
    });
  }
  
  const user = await User.findById(req.params.id).select(select);
  res.json({ data: user });
});
\`\`\`

## Performance Optimization Checklist

- ✅ Use connection pooling for database connections
- ✅ Implement caching layers (Redis, Memcached)
- ✅ Enable HTTP/2 for multiplexing
- ✅ Use CDN for static assets
- ✅ Implement database indexing
- ✅ Monitor with APM tools (New Relic, DataDog)
- ✅ Use load balancers for horizontal scaling

## Versioning Strategy

I recommend URI versioning for clarity:

\`\`\`javascript
// Version 1
app.use('/api/v1', require('./routes/v1'));

// Version 2 with breaking changes
app.use('/api/v2', require('./routes/v2'));
\`\`\``,
    conclusion: 'Building high-performance APIs requires thinking about scale from day one. By implementing these patterns early, you\'ll save countless hours of refactoring later. Remember: premature optimization is bad, but informed design decisions are essential.',
    references: [
      { title: 'REST API Design Rulebook', url: 'https://www.oreilly.com/library/view/rest-api-design/9781449317904/' },
      { title: 'HTTP/1.1 Specification', url: 'https://tools.ietf.org/html/rfc7231' },
      { title: 'API Rate Limiting Patterns', url: 'https://redis.io/docs/manual/patterns/rate-limiter/' },
    ],
  },
  {
    id: '2',
    title: 'PostgreSQL Query Optimization: From Slow to Milliseconds',
    date: '2026-02-01',
    author: 'Sarah Johnson',
    tags: ['Database', 'PostgreSQL', 'Performance', 'SQL'],
    overview: 'Learn how to identify and fix slow queries in PostgreSQL. We\'ll cover EXPLAIN ANALYZE, index strategies, query rewriting, and common pitfalls that destroy database performance.',
    readTime: 15,
    body: `## The Problem

You've got a query that's taking 5 seconds. Users are complaining. Let's fix it.

## Step 1: Identify the Culprit

Use EXPLAIN ANALYZE to see what's actually happening:

\`\`\`sql
EXPLAIN ANALYZE
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2025-01-01'
GROUP BY u.id
ORDER BY order_count DESC
LIMIT 10;
\`\`\`

Look for:
- **Sequential Scans** on large tables
- **High cost** estimates
- **Actual time** vs **planned time** discrepancies

## Step 2: Add Strategic Indexes

\`\`\`sql
-- Index on foreign key
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Composite index for WHERE + ORDER BY
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Partial index for common filters
CREATE INDEX idx_active_users 
ON users(created_at) 
WHERE status = 'active';
\`\`\`

## Step 3: Rewrite the Query

Sometimes the query structure is the problem:

\`\`\`sql
-- Before: Slow aggregation
SELECT u.*, 
  (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count
FROM users u
WHERE u.created_at > '2025-01-01'
ORDER BY order_count DESC
LIMIT 10;

-- After: Much faster with proper JOIN
WITH user_orders AS (
  SELECT user_id, COUNT(*) as order_count
  FROM orders
  WHERE created_at > '2025-01-01'
  GROUP BY user_id
)
SELECT u.*, COALESCE(uo.order_count, 0) as order_count
FROM users u
LEFT JOIN user_orders uo ON u.id = uo.user_id
WHERE u.created_at > '2025-01-01'
ORDER BY order_count DESC
LIMIT 10;
\`\`\`

## Step 4: Optimize Table Statistics

\`\`\`sql
-- Update statistics for the query planner
ANALYZE users;
ANALYZE orders;

-- Or for the entire database
VACUUM ANALYZE;
\`\`\`

## Advanced Techniques

### Materialized Views for Complex Aggregations

\`\`\`sql
CREATE MATERIALIZED VIEW user_order_summary AS
SELECT 
  u.id,
  u.email,
  COUNT(o.id) as total_orders,
  SUM(o.amount) as total_spent,
  MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.email;

CREATE INDEX ON user_order_summary(total_spent DESC);

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY user_order_summary;
\`\`\`

### Partitioning for Time-Series Data

\`\`\`sql
-- Parent table
CREATE TABLE logs (
  id BIGSERIAL,
  created_at TIMESTAMP NOT NULL,
  message TEXT,
  level VARCHAR(20)
) PARTITION BY RANGE (created_at);

-- Monthly partitions
CREATE TABLE logs_2026_01 PARTITION OF logs
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE logs_2026_02 PARTITION OF logs
FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
\`\`\`

## Monitoring Query Performance

\`\`\`sql
-- Enable pg_stat_statements extension
CREATE EXTENSION pg_stat_statements;

-- Find slowest queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
\`\`\``,
    conclusion: 'Database optimization is an iterative process. Start with EXPLAIN ANALYZE, add appropriate indexes, and consider query rewrites. Always measure the impact of your changes in production-like environments.',
    references: [
      { title: 'PostgreSQL Performance Tuning', url: 'https://www.postgresql.org/docs/current/performance-tips.html' },
      { title: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com/' },
      { title: 'pg_stat_statements Documentation', url: 'https://www.postgresql.org/docs/current/pgstatstatements.html' },
    ],
  },
  {
    id: '3',
    title: 'Microservices Architecture: Communication Patterns That Scale',
    date: '2026-01-28',
    author: 'Michael Rodriguez',
    tags: ['Microservices', 'Architecture', 'Kafka', 'gRPC'],
    overview: 'Exploring communication strategies between microservices: synchronous vs asynchronous, event-driven architectures, message queues, and when to use each pattern in production systems.',
    readTime: 18,
    series: 'Microservices Deep Dive',
    body: `## Communication Patterns Overview

When building microservices, choosing the right communication pattern is crucial for system reliability and performance.

## 1. Synchronous Communication: REST & gRPC

### REST API Example

\`\`\`javascript
// User Service
app.post('/api/users', async (req, res) => {
  const user = await User.create(req.body);
  
  // Synchronous call to Email Service
  try {
    await axios.post('http://email-service/api/send', {
      to: user.email,
      template: 'welcome',
    });
  } catch (error) {
    console.error('Email service failed:', error);
    // User is created even if email fails
  }
  
  res.json({ data: user });
});
\`\`\`

### gRPC for Internal Services

\`\`\`protobuf
// user.proto
syntax = "proto3";

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc CreateUser (CreateUserRequest) returns (User);
}

message User {
  string id = 1;
  string email = 2;
  string name = 3;
}
\`\`\`

\`\`\`javascript
// gRPC Server
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('user.proto');
const userProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(userProto.UserService.service, {
  getUser: async (call, callback) => {
    const user = await User.findById(call.request.id);
    callback(null, user);
  },
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => server.start()
);
\`\`\`

## 2. Asynchronous Communication: Message Queues

### RabbitMQ Pattern

\`\`\`javascript
const amqp = require('amqplib');

// Producer
async function publishUserCreated(user) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  const exchange = 'user.events';
  await channel.assertExchange(exchange, 'topic', { durable: true });
  
  channel.publish(
    exchange,
    'user.created',
    Buffer.from(JSON.stringify(user)),
    { persistent: true }
  );
  
  console.log('Published user.created event');
}

// Consumer
async function consumeUserEvents() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  const exchange = 'user.events';
  const queue = 'email-service-queue';
  
  await channel.assertExchange(exchange, 'topic', { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, 'user.*');
  
  channel.consume(queue, async (msg) => {
    const user = JSON.parse(msg.content.toString());
    
    try {
      await sendWelcomeEmail(user);
      channel.ack(msg);
    } catch (error) {
      console.error('Failed to process:', error);
      channel.nack(msg, false, true); // Requeue
    }
  });
}
\`\`\`

## 3. Event-Driven with Kafka

\`\`\`javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['localhost:9092'],
});

// Producer
const producer = kafka.producer();

async function publishEvent(topic, event) {
  await producer.connect();
  await producer.send({
    topic,
    messages: [
      {
        key: event.id,
        value: JSON.stringify(event),
        headers: {
          'correlation-id': generateId(),
          'timestamp': Date.now().toString(),
        },
      },
    ],
  });
}

// Consumer with Consumer Group
const consumer = kafka.consumer({ groupId: 'email-service-group' });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-events', fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      
      console.log({
        partition,
        offset: message.offset,
        value: event,
      });
      
      // Process event
      if (event.type === 'USER_CREATED') {
        await handleUserCreated(event.data);
      }
    },
  });
}
\`\`\`

## 4. SAGA Pattern for Distributed Transactions

\`\`\`javascript
// Orchestration-based SAGA
class OrderSaga {
  async createOrder(orderData) {
    const sagaId = generateId();
    
    try {
      // Step 1: Reserve inventory
      const inventory = await this.inventoryService.reserve(
        orderData.items,
        { sagaId }
      );
      
      // Step 2: Process payment
      const payment = await this.paymentService.charge(
        orderData.payment,
        { sagaId }
      );
      
      // Step 3: Create order
      const order = await this.orderService.create({
        ...orderData,
        inventoryId: inventory.id,
        paymentId: payment.id,
      });
      
      return order;
    } catch (error) {
      // Compensating transactions
      await this.compensate(sagaId, error);
      throw error;
    }
  }
  
  async compensate(sagaId, error) {
    // Rollback in reverse order
    await this.paymentService.refund(sagaId);
    await this.inventoryService.release(sagaId);
  }
}
\`\`\`

## Pattern Selection Guide

| Pattern | Use When | Avoid When |
|---------|----------|------------|
| REST | Simple CRUD, external APIs | High throughput internal comms |
| gRPC | Internal service-to-service | Public-facing APIs |
| Message Queue | Async tasks, decoupling | Need immediate response |
| Kafka | Event sourcing, streaming | Simple request-response |
| SAGA | Distributed transactions | Single database transactions |`,
    conclusion: 'Choose communication patterns based on your specific requirements: latency, throughput, reliability, and coupling. Most systems use a combination of patterns. Start simple with REST, add async processing with queues, and introduce event streaming as you scale.',
    references: [
      { title: 'Microservices Patterns', url: 'https://microservices.io/patterns/index.html' },
      { title: 'gRPC Documentation', url: 'https://grpc.io/docs/' },
      { title: 'Kafka: The Definitive Guide', url: 'https://www.confluent.io/resources/kafka-the-definitive-guide/' },
    ],
  },
  {
    id: '4',
    title: 'Container Security: Hardening Docker Images in Production',
    date: '2026-01-25',
    author: 'Alex Chen',
    tags: ['Security', 'Docker', 'DevOps', 'Best Practices'],
    overview: 'A practical guide to securing Docker containers for production environments. Covers image scanning, minimal base images, secrets management, and runtime security configurations.',
    readTime: 10,
    body: `## Security Fundamentals

Container security starts at build time and continues through runtime.

## 1. Use Minimal Base Images

\`\`\`dockerfile
# ❌ Bad: Full OS image
FROM ubuntu:latest
RUN apt-get update && apt-get install -y nodejs

# ✅ Good: Minimal base
FROM node:18-alpine
\`\`\`

Alpine Linux reduces attack surface by 90%+

## 2. Multi-Stage Builds

\`\`\`dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodejs -u 1001

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

USER nodejs
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

## 3. Scan for Vulnerabilities

\`\`\`bash
# Using Trivy
trivy image myapp:latest

# Using Snyk
snyk container test myapp:latest

# Fail CI/CD on high severity
trivy image --severity HIGH,CRITICAL --exit-code 1 myapp:latest
\`\`\`

## 4. Secrets Management

\`\`\`dockerfile
# ❌ Never hardcode secrets
ENV DATABASE_PASSWORD=mysecret

# ✅ Use Docker secrets or env vars at runtime
\`\`\`

\`\`\`yaml
# docker-compose.yml with secrets
services:
  app:
    image: myapp:latest
    secrets:
      - db_password
      
secrets:
  db_password:
    external: true
\`\`\`

## 5. Runtime Security

\`\`\`bash
# Run with read-only filesystem
docker run --read-only myapp:latest

# Drop all capabilities, add only what's needed
docker run \\
  --cap-drop=ALL \\
  --cap-add=NET_BIND_SERVICE \\
  myapp:latest

# Use security profiles
docker run \\
  --security-opt=no-new-privileges \\
  --security-opt=apparmor=docker-default \\
  myapp:latest
\`\`\`

## 6. Network Security

\`\`\`yaml
# docker-compose.yml
services:
  app:
    networks:
      - frontend
      
  db:
    networks:
      - backend
      
networks:
  frontend:
  backend:
    internal: true  # No external access
\`\`\``,
    conclusion: 'Container security is multi-layered. Start with minimal images, scan regularly, never embed secrets, and apply runtime restrictions. Security should be automated in your CI/CD pipeline.',
    references: [
      { title: 'Docker Security Best Practices', url: 'https://docs.docker.com/develop/security-best-practices/' },
      { title: 'CIS Docker Benchmark', url: 'https://www.cisecurity.org/benchmark/docker' },
    ],
  },
];
