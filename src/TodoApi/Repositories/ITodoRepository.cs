using TodoApi.Models;

namespace TodoApi.Repositories;

public interface ITodoRepository
{
    IReadOnlyCollection<TodoItem> GetAll();

    TodoItem? GetById(Guid id);

    TodoItem Create(TodoItem item);

    bool Update(TodoItem item);

    bool Delete(Guid id);
}

