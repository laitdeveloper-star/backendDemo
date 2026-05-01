# C# REST API Starter

這個專案是一個使用 ASP.NET Core 建立的 C# REST API 範本，提供基本的 `Todo` CRUD API。

## 需求

- .NET 8 SDK

## 啟動方式

在專案根目錄執行：

```powershell
dotnet run --project .\src\TodoApi\TodoApi.csproj
```

預設網址：

- `http://localhost:5024`
- `https://localhost:7197`

## API 路由

- `GET /api/todos`
- `GET /api/todos/{id}`
- `POST /api/todos`
- `PUT /api/todos/{id}`
- `DELETE /api/todos/{id}`

## POST 範例

```json
{
  "title": "Write API documentation",
  "description": "Add endpoint examples",
  "isCompleted": false
}
```

## 專案結構

- `src/TodoApi/Controllers`: API endpoints
- `src/TodoApi/Models`: 資料模型
- `src/TodoApi/Dtos`: request DTO
- `src/TodoApi/Repositories`: 資料存取層

