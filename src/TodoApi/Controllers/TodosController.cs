using Microsoft.AspNetCore.Mvc;
using TodoApi.Dtos;
using TodoApi.Models;
using TodoApi.Repositories;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly ITodoRepository _todoRepository;

    public TodosController(ITodoRepository todoRepository)
    {
        _todoRepository = todoRepository;
    }

    [HttpGet]
    public ActionResult<IReadOnlyCollection<TodoItem>> GetAll()
    {
        return Ok(_todoRepository.GetAll());
    }

    [HttpGet("{id:guid}")]
    public ActionResult<TodoItem> GetById(Guid id)
    {
        var item = _todoRepository.GetById(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public ActionResult<TodoItem> Create(CreateTodoItemRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            ModelState.AddModelError(nameof(request.Title), "Title is required.");
            return ValidationProblem(ModelState);
        }

        var item = new TodoItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            IsCompleted = request.IsCompleted,
            CreatedAtUtc = DateTime.UtcNow
        };

        _todoRepository.Create(item);

        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id:guid}")]
    public ActionResult<TodoItem> Update(Guid id, UpdateTodoItemRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            ModelState.AddModelError(nameof(request.Title), "Title is required.");
            return ValidationProblem(ModelState);
        }

        var existingItem = _todoRepository.GetById(id);
        if (existingItem is null)
        {
            return NotFound();
        }

        existingItem.Title = request.Title.Trim();
        existingItem.Description = request.Description.Trim();
        existingItem.IsCompleted = request.IsCompleted;

        _todoRepository.Update(existingItem);

        return Ok(existingItem);
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
    {
        return _todoRepository.Delete(id) ? NoContent() : NotFound();
    }
}

