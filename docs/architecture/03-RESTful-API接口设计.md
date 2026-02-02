# RESTful API 接口设计

## 1. API 设计原则

### 1.1 基本规范
- **基础路径**：`https://api.yourblog.com/v1`
- **协议**：HTTPS
- **数据格式**：JSON
- **字符编码**：UTF-8
- **HTTP 方法**：GET、POST、PUT、PATCH、DELETE
- **版本控制**：在 URL 中体现（`/v1`、`/v2`）

### 1.2 命名约定
- 使用小写字母和连字符（kebab-case）
- 资源使用复数名词：`/articles`、`/users`
- 避免动词，用 HTTP 方法表示操作

### 1.3 响应格式

**成功响应**：
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功",
  "timestamp": 1704038400000
}
```

**失败响应**：
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数验证失败",
    "details": [
      { "field": "email", "message": "邮箱格式不正确" }
    ]
  },
  "timestamp": 1704038400000
}
```

**分页响应**：
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": 1704038400000
}
```

---

## 2. 认证与授权

### 2.1 用户认证

#### 2.1.1 用户注册
```http
POST /v1/auth/register
Content-Type: application/json

Request Body:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "nickname": "John Doe"
}

Response 201:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "nickname": "John Doe",
      "avatar": null,
      "role": "user",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功"
}
```

#### 2.1.2 用户登录
```http
POST /v1/auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400  // 秒
  },
  "message": "登录成功"
}
```

#### 2.1.3 退出登录
```http
POST /v1/auth/logout
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "退出成功"
}
```

#### 2.1.4 刷新 Token
```http
POST /v1/auth/refresh
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "token": "new_token_here",
    "expiresIn": 86400
  }
}
```

#### 2.1.5 获取当前用户信息
```http
GET /v1/auth/me
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "nickname": "John Doe",
    "avatar": "https://cdn.example.com/avatars/1.jpg",
    "bio": "热爱编程的技术博主",
    "role": "user",
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## 3. 用户管理

### 3.1 用户 CRUD

#### 3.1.1 获取用户列表（管理员）
```http
GET /v1/users?page=1&pageSize=20&role=user&status=active
Authorization: Bearer {admin_token}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "nickname": "John Doe",
      "role": "user",
      "status": "active",
      "articleCount": 10,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### 3.1.2 获取用户详情
```http
GET /v1/users/:id

Response 200:
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "nickname": "John Doe",
    "avatar": "https://cdn.example.com/avatars/1.jpg",
    "bio": "热爱编程的技术博主",
    "role": "user",
    "articleCount": 10,
    "commentCount": 25,
    "likeCount": 100,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 3.1.3 更新用户信息
```http
PUT /v1/users/:id
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "nickname": "新昵称",
  "bio": "个人简介更新",
  "avatar": "https://cdn.example.com/avatars/new.jpg"
}

Response 200:
{
  "success": true,
  "data": { ... },
  "message": "更新成功"
}
```

#### 3.1.4 修改密码
```http
POST /v1/users/:id/change-password
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "oldPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}

Response 200:
{
  "success": true,
  "message": "密码修改成功"
}
```

---

## 4. 文章管理

### 4.1 文章 CRUD

#### 4.1.1 获取文章列表
```http
GET /v1/articles?page=1&pageSize=20&status=published&categoryId=1&tagId=2&sort=latest

Query Parameters:
- page: 页码（默认 1）
- pageSize: 每页数量（默认 20，最大 100）
- status: 文章状态（published/draft/hidden）
- categoryId: 分类 ID
- tagId: 标签 ID
- keyword: 搜索关键词
- sort: 排序方式（latest/popular/top）

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "深入理解 React Hooks",
      "slug": "understanding-react-hooks",
      "summary": "本文详细介绍 React Hooks 的原理和应用...",
      "coverImage": "https://cdn.example.com/covers/1.jpg",
      "author": {
        "id": 1,
        "username": "johndoe",
        "nickname": "John Doe",
        "avatar": "https://cdn.example.com/avatars/1.jpg"
      },
      "category": {
        "id": 1,
        "name": "前端",
        "slug": "frontend"
      },
      "tags": [
        { "id": 1, "name": "React", "slug": "react", "color": "#61DAFB" },
        { "id": 2, "name": "JavaScript", "slug": "javascript", "color": "#F7DF1E" }
      ],
      "viewCount": 1200,
      "likeCount": 50,
      "commentCount": 10,
      "isTop": false,
      "isFeatured": true,
      "publishedAt": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### 4.1.2 获取文章详情
```http
GET /v1/articles/:id
// 或者
GET /v1/articles/slug/:slug

Response 200:
{
  "success": true,
  "data": {
    "id": 1,
    "title": "深入理解 React Hooks",
    "slug": "understanding-react-hooks",
    "summary": "本文详细介绍 React Hooks 的原理和应用...",
    "content": "<p>文章完整内容...</p>",  // HTML 或 Markdown
    "coverImage": "https://cdn.example.com/covers/1.jpg",
    "author": { ... },
    "category": { ... },
    "tags": [ ... ],
    "viewCount": 1200,
    "likeCount": 50,
    "commentCount": 10,
    "isTop": false,
    "isFeatured": true,
    "publishedAt": "2024-01-01T00:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-05T00:00:00Z",
    // 相关推荐
    "relatedArticles": [
      { "id": 2, "title": "...", "slug": "..." }
    ]
  }
}
```

#### 4.1.3 创建文章
```http
POST /v1/articles
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "新文章标题",
  "slug": "new-article-slug",  // 可选，自动生成
  "summary": "文章摘要",
  "content": "文章完整内容...",
  "coverImage": "https://cdn.example.com/covers/new.jpg",
  "categoryId": 1,
  "tagIds": [1, 2, 3],
  "status": "draft",  // draft/published/hidden
  "isTop": false,
  "isFeatured": false
}

Response 201:
{
  "success": true,
  "data": { ... },
  "message": "文章创建成功"
}
```

#### 4.1.4 更新文章
```http
PUT /v1/articles/:id
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "更新后的标题",
  "content": "更新后的内容...",
  "status": "published"
}

Response 200:
{
  "success": true,
  "data": { ... },
  "message": "文章更新成功"
}
```

#### 4.1.5 删除文章
```http
DELETE /v1/articles/:id
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "文章删除成功"
}
```

#### 4.1.6 点赞文章
```http
POST /v1/articles/:id/like
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "liked": true,  // true=已点赞, false=取消点赞
    "likeCount": 51
  }
}
```

---

## 5. 分类管理

#### 5.1.1 获取分类列表
```http
GET /v1/categories?includeCount=true

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "技术",
      "slug": "tech",
      "description": "技术相关文章",
      "icon": "💻",
      "parentId": null,
      "articleCount": 50,
      "children": [
        {
          "id": 2,
          "name": "前端",
          "slug": "frontend",
          "parentId": 1,
          "articleCount": 30
        }
      ]
    }
  ]
}
```

#### 5.1.2 创建分类（管理员）
```http
POST /v1/categories
Authorization: Bearer {admin_token}
Content-Type: application/json

Request Body:
{
  "name": "新分类",
  "slug": "new-category",
  "description": "分类描述",
  "parentId": null,
  "icon": "🔥"
}

Response 201:
{
  "success": true,
  "data": { ... },
  "message": "分类创建成功"
}
```

#### 5.1.3 更新分类（管理员）
```http
PUT /v1/categories/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

Request Body:
{
  "name": "更新后的名称",
  "sortOrder": 10
}

Response 200:
{
  "success": true,
  "data": { ... },
  "message": "分类更新成功"
}
```

#### 5.1.4 删除分类（管理员）
```http
DELETE /v1/categories/:id
Authorization: Bearer {admin_token}

Response 200:
{
  "success": true,
  "message": "分类删除成功"
}
```

---

## 6. 标签管理

#### 6.1.1 获取标签列表
```http
GET /v1/tags?sort=popular&limit=50

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "React",
      "slug": "react",
      "color": "#61DAFB",
      "articleCount": 20
    }
  ]
}
```

#### 6.1.2 创建标签（管理员）
```http
POST /v1/tags
Authorization: Bearer {admin_token}
Content-Type: application/json

Request Body:
{
  "name": "新标签",
  "slug": "new-tag",
  "color": "#3B82F6"
}

Response 201:
{
  "success": true,
  "data": { ... },
  "message": "标签创建成功"
}
```

---

## 7. 评论管理

#### 7.1.1 获取文章评论列表
```http
GET /v1/articles/:articleId/comments?page=1&pageSize=20&sort=latest

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "content": "写得很好！",
      "user": {
        "id": 2,
        "username": "reader1",
        "nickname": "读者一号",
        "avatar": "https://cdn.example.com/avatars/2.jpg"
      },
      "parentId": null,
      "rootId": null,
      "likeCount": 5,
      "replyCount": 2,
      "status": "approved",
      "createdAt": "2024-01-01T00:00:00Z",
      // 子评论（回复）
      "replies": [
        {
          "id": 2,
          "content": "谢谢支持！",
          "user": { ... },
          "parentId": 1,
          "rootId": 1,
          "createdAt": "2024-01-01T01:00:00Z"
        }
      ]
    }
  ],
  "pagination": { ... }
}
```

#### 7.1.2 发表评论
```http
POST /v1/articles/:articleId/comments
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "content": "这篇文章写得真好！",
  "parentId": null  // 如果是回复评论，则填写父评论 ID
}

Response 201:
{
  "success": true,
  "data": { ... },
  "message": "评论发表成功"
}
```

#### 7.1.3 删除评论
```http
DELETE /v1/comments/:id
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "评论删除成功"
}
```

#### 7.1.4 点赞评论
```http
POST /v1/comments/:id/like
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "liked": true,
    "likeCount": 6
  }
}
```

---

## 8. 搜索功能

#### 8.1.1 全文搜索
```http
GET /v1/search?q=react&type=article&page=1&pageSize=20

Query Parameters:
- q: 搜索关键词
- type: 搜索类型（article/user/tag）
- page: 页码
- pageSize: 每页数量

Response 200:
{
  "success": true,
  "data": {
    "articles": [ ... ],
    "tags": [ ... ],
    "users": [ ... ]
  },
  "pagination": { ... }
}
```

---

## 9. 文件上传

#### 9.1.1 上传图片
```http
POST /v1/upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body:
{
  "file": <binary>,
  "type": "avatar" | "cover" | "content"
}

Response 200:
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/images/abc123.jpg",
    "filename": "abc123.jpg",
    "size": 102400,
    "mimeType": "image/jpeg"
  }
}
```

---

## 10. 统计与分析（管理员）

#### 10.1.1 获取统计数据
```http
GET /v1/admin/stats
Authorization: Bearer {admin_token}

Response 200:
{
  "success": true,
  "data": {
    "totalArticles": 100,
    "totalUsers": 500,
    "totalComments": 1000,
    "totalViews": 50000,
    "todayArticles": 5,
    "todayUsers": 10,
    "todayViews": 1200,
    "popularArticles": [ ... ],
    "recentComments": [ ... ]
  }
}
```

---

## 11. 错误码定义

| HTTP 状态码 | 错误码 | 说明 |
|------------|--------|------|
| 400 | VALIDATION_ERROR | 参数验证失败 |
| 401 | UNAUTHORIZED | 未认证（未登录） |
| 403 | FORBIDDEN | 无权限访问 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | CONFLICT | 资源冲突（如重复注册） |
| 429 | TOO_MANY_REQUESTS | 请求过于频繁 |
| 500 | INTERNAL_SERVER_ERROR | 服务器内部错误 |

---

## 12. 限流策略

- **未登录用户**：每分钟 60 次请求
- **登录用户**：每分钟 120 次请求
- **管理员**：每分钟 200 次请求

---

## 13. API 测试工具

推荐使用以下工具测试 API：
- **Postman**：可视化 API 测试
- **Insomnia**：轻量级 REST 客户端
- **cURL**：命令行测试

---

## 14. 完整 API 列表汇总

### 认证模块
- `POST /v1/auth/register` - 用户注册
- `POST /v1/auth/login` - 用户登录
- `POST /v1/auth/logout` - 退出登录
- `POST /v1/auth/refresh` - 刷新 Token
- `GET /v1/auth/me` - 获取当前用户信息

### 用户模块
- `GET /v1/users` - 获取用户列表
- `GET /v1/users/:id` - 获取用户详情
- `PUT /v1/users/:id` - 更新用户信息
- `POST /v1/users/:id/change-password` - 修改密码

### 文章模块
- `GET /v1/articles` - 获取文章列表
- `GET /v1/articles/:id` - 获取文章详情
- `GET /v1/articles/slug/:slug` - 通过 slug 获取文章
- `POST /v1/articles` - 创建文章
- `PUT /v1/articles/:id` - 更新文章
- `DELETE /v1/articles/:id` - 删除文章
- `POST /v1/articles/:id/like` - 点赞文章

### 分类模块
- `GET /v1/categories` - 获取分类列表
- `POST /v1/categories` - 创建分类
- `PUT /v1/categories/:id` - 更新分类
- `DELETE /v1/categories/:id` - 删除分类

### 标签模块
- `GET /v1/tags` - 获取标签列表
- `POST /v1/tags` - 创建标签
- `PUT /v1/tags/:id` - 更新标签
- `DELETE /v1/tags/:id` - 删除标签

### 评论模块
- `GET /v1/articles/:articleId/comments` - 获取文章评论
- `POST /v1/articles/:articleId/comments` - 发表评论
- `DELETE /v1/comments/:id` - 删除评论
- `POST /v1/comments/:id/like` - 点赞评论

### 搜索模块
- `GET /v1/search` - 全文搜索

### 上传模块
- `POST /v1/upload/image` - 上传图片

### 管理员模块
- `GET /v1/admin/stats` - 获取统计数据
