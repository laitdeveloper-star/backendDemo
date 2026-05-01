$(function () {
  const state = {
    todos: []
  };

  const $apiBaseUrlInput = $("#apiBaseUrl");
  const $loadTodosButton = $("#loadTodosButton");
  const $todoForm = $("#todoForm");
  const $todoList = $("#todoList");
  const $emptyState = $("#emptyState");
  const $statusText = $("#statusText");

  function getApiBaseUrl() {
    return String($apiBaseUrlInput.val() ?? "").trim().replace(/\/$/, "");
  }

  function setStatus(message) {
    $statusText.text(message);
  }

  function escapeHtml(value) {
    return $("<div>").text(value).html();
  }

  function renderTodos() {
    $todoList.empty();

    if (state.todos.length === 0) {
      $emptyState.prop("hidden", false);
      return;
    }

    $emptyState.prop("hidden", true);

    $.each(state.todos, function (_, todo) {
      const cardHtml = `
        <li>
          <article class="todo-card ${todo.isCompleted ? "completed" : ""}">
            <div class="todo-top">
              <div>
                <h3 class="todo-title">${escapeHtml(todo.title)}</h3>
                <p class="todo-meta">Created: ${new Date(todo.createdAtUtc).toLocaleString()}</p>
              </div>
              <span class="badge ${todo.isCompleted ? "badge-done" : "badge-open"}">
                ${todo.isCompleted ? "Completed" : "Open"}
              </span>
            </div>
            <p class="todo-description">${escapeHtml(todo.description || "No description provided.")}</p>
            <div class="todo-actions">
              <button class="action-button toggle" data-action="toggle" data-id="${todo.id}" type="button">
                ${todo.isCompleted ? "Mark Incomplete" : "Mark Complete"}
              </button>
              <button class="action-button delete" data-action="delete" data-id="${todo.id}" type="button">
                Delete
              </button>
            </div>
          </article>
        </li>
      `;

      $todoList.append(cardHtml);
    });
  }

  function fetchTodos() {
    setStatus("Loading todos...");

    return $.ajax({
      url: `${getApiBaseUrl()}/api/todos`,
      method: "GET"
    })
      .done(function (data) {
        state.todos = data;
        renderTodos();
        setStatus(`Loaded ${state.todos.length} todo item(s).`);
      })
      .fail(function (xhr) {
        const message = xhr.status ? `Request failed with status ${xhr.status}` : "Network error";
        setStatus(`Unable to load todos: ${message}`);
        $emptyState.prop("hidden", false);
        $todoList.empty();
      });
  }

  function createTodo(event) {
    event.preventDefault();

    const payload = {
      title: String($("#title").val() ?? "").trim(),
      description: String($("#description").val() ?? "").trim(),
      isCompleted: $("#isCompleted").is(":checked")
    };

    setStatus("Creating todo...");

    $.ajax({
      url: `${getApiBaseUrl()}/api/todos`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload)
    })
      .done(function () {
        $todoForm.trigger("reset");
        fetchTodos().done(function () {
          setStatus("Todo created successfully.");
        });
      })
      .fail(function (xhr) {
        const message = xhr.status ? `Request failed with status ${xhr.status}` : "Network error";
        setStatus(`Unable to create todo: ${message}`);
      });
  }

  function toggleTodo(id) {
    const todo = state.todos.find(function (item) {
      return item.id === id;
    });

    if (!todo) {
      return;
    }

    setStatus(`Updating "${todo.title}"...`);

    $.ajax({
      url: `${getApiBaseUrl()}/api/todos/${id}`,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify({
        title: todo.title,
        description: todo.description,
        isCompleted: !todo.isCompleted
      })
    })
      .done(function () {
        fetchTodos().done(function () {
          setStatus(`Updated "${todo.title}".`);
        });
      })
      .fail(function (xhr) {
        const message = xhr.status ? `Request failed with status ${xhr.status}` : "Network error";
        setStatus(`Unable to update todo: ${message}`);
      });
  }

  function deleteTodo(id) {
    const todo = state.todos.find(function (item) {
      return item.id === id;
    });

    setStatus(`Deleting "${todo ? todo.title : "todo"}"...`);

    $.ajax({
      url: `${getApiBaseUrl()}/api/todos/${id}`,
      method: "DELETE"
    })
      .done(function () {
        fetchTodos().done(function () {
          setStatus(`Deleted "${todo ? todo.title : "todo"}".`);
        });
      })
      .fail(function (xhr) {
        const message = xhr.status ? `Request failed with status ${xhr.status}` : "Network error";
        setStatus(`Unable to delete todo: ${message}`);
      });
  }

  $loadTodosButton.on("click", fetchTodos);
  $todoForm.on("submit", createTodo);
  $todoList.on("click", "button[data-action]", function () {
    const $button = $(this);
    const action = $button.data("action");
    const id = $button.data("id");

    if (!id) {
      return;
    }

    if (action === "toggle") {
      toggleTodo(id);
    }

    if (action === "delete") {
      deleteTodo(id);
    }
  });

  renderTodos();
});
