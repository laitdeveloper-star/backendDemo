using System.Collections.Concurrent;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class InMemoryTodoRepository : ITodoRepository
{
    private readonly ConcurrentDictionary<Guid, TodoItem> _items = new();

    public IReadOnlyCollection<TodoItem> GetAll()
    {
        return _items.Values
            .OrderByDescending(item => item.CreatedAtUtc)
            .ToArray();
    }

    public TodoItem? GetById(Guid id)
    {
        return _items.TryGetValue(id, out var item) ? item : null;
    }

    public TodoItem Create(TodoItem item)
    {
        _items[item.Id] = item;
        return item;
    }

    public bool Update(TodoItem item)
    {
        if (!_items.ContainsKey(item.Id))
        {
            return false;
        }

        _items[item.Id] = item;
        return true;
    }

    public bool Delete(Guid id)
    {
        return _items.TryRemove(id, out _);
    }
}

