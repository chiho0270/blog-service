import type { Post } from '../types/blog';

export const samplePosts: Post[] = [
  {
    id: '1',
    title: '고성능 REST API 구축하기: Best Practices & Patterns',
    date: '2026-02-05',
    author: '김개발',
    tags: ['API Design', 'REST', 'Performance', 'Node.js'],
    overview: '수백만 요청을 처리할 수 있는 REST API를 설계하고 구현하는 완벽 가이드. 버전 관리 전략, 페이지네이션 패턴, Rate Limiting, 응답 최적화 기법까지 실전에서 검증된 패턴들을 다룹니다.',
    readTime: 12,
    series: 'API Design Mastery',
    body: `## Introduction

REST API는 현대 웹 애플리케이션의 근간입니다. 이 포스트에서는 단순히 작동하는 것을 넘어, 고성능이면서 유지보수가 쉬운 API를 구축하기 위한 실전 패턴들을 알아봅니다.

## 핵심 원칙

### 1. Resource Naming Conventions

동사가 아닌 명사를 사용하세요. 일관성과 예측 가능성이 핵심입니다:

\`\`\`javascript
// ✅ Good
GET /api/v1/users
POST /api/v1/users
GET /api/v1/users/:id
PUT /api/v1/users/:id
DELETE /api/v1/users/:id

// ❌ Bad
GET /api/v1/getAllUsers
POST /api/v1/createUser
\`\`\`

### 2. Pagination은 처음부터 구현하세요

"나중에 필요하면 추가하지 뭐" → 🚨 큰 실수입니다. Cursor 기반 접근법:

\`\`\`javascript
// Express.js 예제
app.get('/api/v1/users', async (req, res) => {
  const { cursor, limit = 20 } = req.query;
  
  const query = {
    limit: parseInt(limit) + 1, // 다음 페이지 존재 여부 확인용
  };
  
  if (cursor) {
    query.where = { id: { $gt: cursor } };
  }
  
  const users = await User.find(query).sort({ id: 1 });
  const hasMore = users.length > limit;
  
  if (hasMore) {
    users.pop(); // 추가로 가져온 항목 제거
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

### 3. Redis로 Rate Limiting 구현

API 남용으로부터 보호하세요:

\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

async function rateLimiter(req, res, next) {
  const key = \`rate_limit:\${req.ip}\`;
  const limit = 100; // 요청 수
  const window = 60; // 초
  
  const current = await client.incr(key);
  
  if (current === 1) {
    await client.expire(key, window);
  }
  
  if (current > limit) {
    return res.status(429).json({
      error: 'Too many requests - 잠시 후 다시 시도해주세요',
      retryAfter: await client.ttl(key),
    });
  }
  
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', limit - current);
  next();
}
\`\`\`

## Performance 최적화 Checklist

- ✅ Database 커넥션 풀링 사용
- ✅ 캐싱 레이어 구현 (Redis, Memcached)
- ✅ HTTP/2 활성화로 멀티플렉싱
- ✅ 정적 자산에 CDN 사용
- ✅ 데이터베이스 인덱싱 구현
- ✅ APM 도구로 모니터링 (New Relic, DataDog)
- ✅ 수평 확장을 위한 로드 밸런서 사용`,
    conclusion: '고성능 API를 구축하려면 첫날부터 확장성을 고려해야 합니다. 이러한 패턴들을 초기에 구현하면 나중에 수많은 리팩토링 시간을 절약할 수 있습니다. 기억하세요: 성급한 최적화는 나쁘지만, 현명한 설계 결정은 필수입니다.',
    references: [
      { title: 'REST API Design Rulebook', url: 'https://www.oreilly.com/library/view/rest-api-design/9781449317904/' },
      { title: 'HTTP/1.1 Specification', url: 'https://tools.ietf.org/html/rfc7231' },
      { title: 'API Rate Limiting Patterns', url: 'https://redis.io/docs/manual/patterns/rate-limiter/' },
    ],
  },
  {
    id: '2',
    title: 'PostgreSQL Query 최적화: 5초에서 밀리초까지',
    date: '2026-02-01',
    author: '이디비',
    tags: ['Database', 'PostgreSQL', 'Performance', 'SQL'],
    overview: 'PostgreSQL에서 느린 쿼리를 찾아 수정하는 방법을 배워봅니다. EXPLAIN ANALYZE, 인덱스 전략, 쿼리 재작성, 그리고 DB 성능을 망치는 흔한 실수들까지!',
    readTime: 15,
    body: `## 문제 상황

쿼리 하나가 5초나 걸립니다. 유저들이 불만을 쏟아내고 있어요. 바로 해결해봅시다.

## Step 1: 범인 찾기

EXPLAIN ANALYZE로 실제로 무슨 일이 일어나는지 확인하세요:

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

주목할 점:
- **Sequential Scans** - 대용량 테이블에서 발견되면 🚨
- **높은 cost** 추정치
- **Actual time** vs **planned time** 차이

## Step 2: 전략적 Index 추가

\`\`\`sql
-- Foreign key에 인덱스
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- WHERE + ORDER BY 복합 인덱스
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- 자주 사용하는 필터에 Partial 인덱스
CREATE INDEX idx_active_users 
ON users(created_at) 
WHERE status = 'active';
\`\`\`

## Step 3: Query 재작성

때로는 쿼리 구조 자체가 문제입니다:

\`\`\`sql
-- Before: 느린 서브쿼리
SELECT u.*, 
  (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count
FROM users u
WHERE u.created_at > '2025-01-01'
ORDER BY order_count DESC
LIMIT 10;

-- After: CTE로 훨씬 빠르게!
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

## Advanced 기법

### Materialized Views로 복잡한 집계 처리

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

-- 주기적으로 리프레시
REFRESH MATERIALIZED VIEW CONCURRENTLY user_order_summary;
\`\`\``,
    conclusion: 'Database 최적화는 반복적인 과정입니다. EXPLAIN ANALYZE로 시작하고, 적절한 인덱스를 추가하고, 쿼리 재작성을 고려하세요. 변경사항은 항상 프로덕션과 유사한 환경에서 측정해야 합니다.',
    references: [
      { title: 'PostgreSQL Performance Tuning', url: 'https://www.postgresql.org/docs/current/performance-tips.html' },
      { title: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com/' },
      { title: 'pg_stat_statements Documentation', url: 'https://www.postgresql.org/docs/current/pgstatstatements.html' },
    ],
  },
  {
    id: '3',
    title: 'Microservices 아키텍처: Scale을 위한 통신 패턴',
    date: '2026-01-28',
    author: '박아키',
    tags: ['Microservices', 'Architecture', 'Kafka', 'gRPC'],
    overview: '마이크로서비스 간 통신 전략 심층 분석: 동기 vs 비동기, Event-driven 아키텍처, Message Queue, 그리고 각 패턴을 언제 사용해야 하는지 실전 가이드.',
    readTime: 18,
    series: 'Microservices Deep Dive',
    body: `## 통신 패턴 Overview

마이크로서비스를 구축할 때 올바른 통신 패턴을 선택하는 것은 시스템 안정성과 성능에 매우 중요합니다.

## 1. Synchronous 통신: REST & gRPC

### REST API 예제

\`\`\`javascript
// User Service
app.post('/api/users', async (req, res) => {
  const user = await User.create(req.body);
  
  // Email Service에 동기 호출
  try {
    await axios.post('http://email-service/api/send', {
      to: user.email,
      template: 'welcome',
    });
  } catch (error) {
    console.error('Email service 실패:', error);
    // 이메일 실패해도 유저는 생성됨
  }
  
  res.json({ data: user });
});
\`\`\`

### 내부 서비스는 gRPC로

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

## 2. Asynchronous 통신: Message Queues

### Kafka로 Event-Driven 구현

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
\`\`\`

## Pattern 선택 가이드

| Pattern | 이럴 때 사용 | 이럴 땐 피하세요 |
|---------|----------|--------------|
| REST | 단순 CRUD, 외부 API | 고처리량 내부 통신 |
| gRPC | 서비스 간 내부 통신 | Public API |
| Message Queue | 비동기 작업, 디커플링 | 즉각적인 응답이 필요할 때 |
| Kafka | Event Sourcing, 스트리밍 | 단순 요청-응답 |`,
    conclusion: '요구사항에 맞는 통신 패턴을 선택하세요: 지연시간, 처리량, 안정성, 결합도를 고려하세요. 대부분의 시스템은 여러 패턴을 조합해서 사용합니다. REST로 시작하고, Queue로 비동기 처리를 추가하고, 규모가 커지면 이벤트 스트리밍을 도입하세요.',
    references: [
      { title: 'Microservices Patterns', url: 'https://microservices.io/patterns/index.html' },
      { title: 'gRPC Documentation', url: 'https://grpc.io/docs/' },
      { title: 'Kafka: The Definitive Guide', url: 'https://www.confluent.io/resources/kafka-the-definitive-guide/' },
    ],
  },
  {
    id: '4',
    title: 'Container Security: Production Docker 이미지 강화하기',
    date: '2026-01-25',
    author: '김개발',
    tags: ['Security', 'Docker', 'DevOps', 'Best Practices'],
    overview: 'Production 환경을 위한 Docker 컨테이너 보안 실전 가이드. 이미지 스캐닝, 최소화된 베이스 이미지, 시크릿 관리, 런타임 보안 설정까지.',
    readTime: 10,
    body: `## Security 기본 원칙

컨테이너 보안은 빌드 타임에 시작해서 런타임까지 이어집니다.

## 1. Minimal Base 이미지 사용

\`\`\`dockerfile
# ❌ Bad: 전체 OS 이미지
FROM ubuntu:latest
RUN apt-get update && apt-get install -y nodejs

# ✅ Good: 최소화된 베이스
FROM node:18-alpine
\`\`\`

Alpine Linux는 공격 표면을 90% 이상 줄여줍니다 🛡️

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

## 3. 취약점 스캔

\`\`\`bash
# Trivy 사용
trivy image myapp:latest

# Snyk 사용
snyk container test myapp:latest

# CI/CD에서 High severity 발견 시 실패
trivy image --severity HIGH,CRITICAL --exit-code 1 myapp:latest
\`\`\`

## 4. Secrets 관리

\`\`\`dockerfile
# ❌ 절대 하드코딩 금지
ENV DATABASE_PASSWORD=mysecret

# ✅ Docker secrets 또는 런타임 env vars 사용
\`\`\`

## 5. Runtime Security

\`\`\`bash
# 읽기 전용 파일시스템으로 실행
docker run --read-only myapp:latest

# 모든 capabilities 제거, 필요한 것만 추가
docker run \\
  --cap-drop=ALL \\
  --cap-add=NET_BIND_SERVICE \\
  myapp:latest
\`\`\``,
    conclusion: '컨테이너 보안은 다층적입니다. 최소 이미지로 시작하고, 정기적으로 스캔하고, 절대 시크릿을 이미지에 넣지 말고, 런타임 제한을 적용하세요. 보안은 CI/CD 파이프라인에서 자동화되어야 합니다.',
    references: [
      { title: 'Docker Security Best Practices', url: 'https://docs.docker.com/develop/security-best-practices/' },
      { title: 'CIS Docker Benchmark', url: 'https://www.cisecurity.org/benchmark/docker' },
    ],
  },
];
