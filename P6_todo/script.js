// Todo App JavaScript
class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.selectedTasks = new Set();
        this.editingTaskId = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.loadTodos();
        this.bindEvents();
        this.renderTodos();
        this.updateStats();
    }

    bindEvents() {
        // Add task
        const addBtn = document.getElementById('addBtn');
        const todoInput = document.getElementById('todoInput');
        
        addBtn.addEventListener('click', () => this.addTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderTodos();
        });

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Bulk actions
        document.getElementById('markAllComplete').addEventListener('click', () => this.bulkMarkComplete());
        document.getElementById('markAllActive').addEventListener('click', () => this.bulkMarkActive());
        document.getElementById('deleteSelected').addEventListener('click', () => this.bulkDelete());

        // Footer actions
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
        document.getElementById('exportTasks').addEventListener('click', () => this.exportTasks());
        document.getElementById('importTasks').addEventListener('click', () => this.importTasks());
        document.getElementById('importFile').addEventListener('change', (e) => this.handleFileImport(e));

        // Modal events
        document.getElementById('saveEdit').addEventListener('click', () => this.saveEdit());
        document.getElementById('cancelEdit').addEventListener('click', () => this.closeModal());
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        
        // Close modal on outside click
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeModal();
            }
        });
    }

    addTodo() {
        const todoInput = document.getElementById('todoInput');
        const text = todoInput.value.trim();
        
        if (text === '') {
            this.showNotification('Please enter a task!', 'error');
            return;
        }

        const todo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            priority: 'medium',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        todoInput.value = '';
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.showNotification('Task added successfully!', 'success');
    }

    deleteTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const todoElement = document.querySelector(`[data-id="${id}"]`);
            if (todoElement) {
                todoElement.classList.add('removing');
                setTimeout(() => {
                    this.todos = this.todos.filter(t => t.id !== id);
                    this.selectedTasks.delete(id);
                    this.saveTodos();
                    this.renderTodos();
                    this.updateStats();
                    this.updateBulkActions();
                    this.showNotification('Task deleted!', 'info');
                }, 300);
            }
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date().toISOString();
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.updateBulkActions();
        }
    }

    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.editingTaskId = id;
            document.getElementById('editInput').value = todo.text;
            document.getElementById('prioritySelect').value = todo.priority;
            this.openModal();
        }
    }

    saveEdit() {
        if (!this.editingTaskId) return;
        
        const newText = document.getElementById('editInput').value.trim();
        const newPriority = document.getElementById('prioritySelect').value;
        
        if (newText === '') {
            this.showNotification('Task text cannot be empty!', 'error');
            return;
        }

        const todo = this.todos.find(t => t.id === this.editingTaskId);
        if (todo) {
            todo.text = newText;
            todo.priority = newPriority;
            todo.updatedAt = new Date().toISOString();
            this.saveTodos();
            this.renderTodos();
            this.closeModal();
            this.showNotification('Task updated successfully!', 'success');
        }
    }

    togglePriority(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const priorities = ['low', 'medium', 'high'];
            const currentIndex = priorities.indexOf(todo.priority);
            const nextIndex = (currentIndex + 1) % priorities.length;
            todo.priority = priorities[nextIndex];
            todo.updatedAt = new Date().toISOString();
            this.saveTodos();
            this.renderTodos();
        }
    }

    toggleTaskSelection(id) {
        if (this.selectedTasks.has(id)) {
            this.selectedTasks.delete(id);
        } else {
            this.selectedTasks.add(id);
        }
        this.updateBulkActions();
        this.renderTodos();
    }

    bulkMarkComplete() {
        this.selectedTasks.forEach(id => {
            const todo = this.todos.find(t => t.id === id);
            if (todo && !todo.completed) {
                todo.completed = true;
                todo.updatedAt = new Date().toISOString();
            }
        });
        this.selectedTasks.clear();
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.updateBulkActions();
        this.showNotification('Selected tasks marked as complete!', 'success');
    }

    bulkMarkActive() {
        this.selectedTasks.forEach(id => {
            const todo = this.todos.find(t => t.id === id);
            if (todo && todo.completed) {
                todo.completed = false;
                todo.updatedAt = new Date().toISOString();
            }
        });
        this.selectedTasks.clear();
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.updateBulkActions();
        this.showNotification('Selected tasks marked as active!', 'success');
    }

    bulkDelete() {
        if (this.selectedTasks.size === 0) return;
        
        if (confirm(`Are you sure you want to delete ${this.selectedTasks.size} task(s)?`)) {
            this.selectedTasks.forEach(id => {
                this.todos = this.todos.filter(t => t.id !== id);
            });
            this.selectedTasks.clear();
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.updateBulkActions();
            this.showNotification('Selected tasks deleted!', 'info');
        }
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showNotification('No completed tasks to clear!', 'info');
            return;
        }

        if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.selectedTasks.clear();
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.updateBulkActions();
            this.showNotification('Completed tasks cleared!', 'success');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTodos();
    }

    getFilteredTodos() {
        let filtered = this.todos;

        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(todo => 
                todo.text.toLowerCase().includes(this.searchTerm)
            );
        }

        // Apply status filter
        switch (this.currentFilter) {
            case 'active':
                filtered = filtered.filter(todo => !todo.completed);
                break;
            case 'completed':
                filtered = filtered.filter(todo => todo.completed);
                break;
            default:
                // 'all' - no additional filtering
                break;
        }

        return filtered;
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            todoList.style.display = 'none';
            emptyState.style.display = 'block';
            
            // Update empty state message based on filter
            const emptyMessage = this.getEmptyStateMessage();
            emptyState.querySelector('h3').textContent = emptyMessage.title;
            emptyState.querySelector('p').textContent = emptyMessage.subtitle;
        } else {
            todoList.style.display = 'block';
            emptyState.style.display = 'none';
            
            todoList.innerHTML = '';
            filteredTodos.forEach(todo => {
                const todoElement = this.createTodoElement(todo);
                todoList.appendChild(todoElement);
            });
        }
    }

    getEmptyStateMessage() {
        if (this.searchTerm) {
            return {
                title: 'No tasks found',
                subtitle: `No tasks match "${this.searchTerm}"`
            };
        }

        switch (this.currentFilter) {
            case 'active':
                return {
                    title: 'No active tasks',
                    subtitle: 'All tasks are completed! Great job!'
                };
            case 'completed':
                return {
                    title: 'No completed tasks',
                    subtitle: 'Complete some tasks to see them here'
                };
            default:
                return {
                    title: 'No tasks yet',
                    subtitle: 'Add your first task to get started!'
                };
        }
    }

    createTodoElement(todo) {
        const template = document.getElementById('taskTemplate');
        const clone = template.content.cloneNode(true);
        const todoElement = clone.querySelector('.todo-item');
        
        todoElement.setAttribute('data-id', todo.id);
        
        if (todo.completed) {
            todoElement.classList.add('completed');
        }

        // Set checkbox state
        const checkbox = todoElement.querySelector('.task-check');
        checkbox.checked = todo.completed;

        // Set task text
        const taskText = todoElement.querySelector('.task-text');
        taskText.textContent = todo.text;

        // Set task date
        const taskDate = todoElement.querySelector('.task-date');
        taskDate.textContent = this.formatDate(todo.createdAt);

        // Set priority
        const priorityElement = todoElement.querySelector('.task-priority');
        priorityElement.textContent = todo.priority;
        priorityElement.className = `task-priority ${todo.priority}`;

        // Bind events
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
        
        const editBtn = todoElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => this.editTodo(todo.id));
        
        const deleteBtn = todoElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
        
        const priorityBtn = todoElement.querySelector('.priority-btn');
        priorityBtn.addEventListener('click', () => this.togglePriority(todo.id));

        // Add selection functionality
        todoElement.addEventListener('click', (e) => {
            if (!e.target.closest('.task-actions') && !e.target.closest('.task-check')) {
                this.toggleTaskSelection(todo.id);
            }
        });

        // Add selection visual indicator
        if (this.selectedTasks.has(todo.id)) {
            todoElement.style.backgroundColor = '#f0f9ff';
            todoElement.style.borderLeft = '4px solid #3b82f6';
        }

        return todoElement;
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const active = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('activeTasks').textContent = active;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('completionRate').textContent = `${completionRate}%`;
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulkActions');
        const selectedCount = document.getElementById('selectedCount');
        
        if (this.selectedTasks.size > 0) {
            bulkActions.style.display = 'block';
            selectedCount.textContent = this.selectedTasks.size;
        } else {
            bulkActions.style.display = 'none';
        }
    }

    openModal() {
        document.getElementById('editModal').style.display = 'block';
        document.getElementById('editInput').focus();
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingTaskId = null;
        document.getElementById('editInput').value = '';
    }

    exportTasks() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Tasks exported successfully!', 'success');
    }

    importTasks() {
        document.getElementById('importFile').click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTodos = JSON.parse(e.target.result);
                if (Array.isArray(importedTodos)) {
                    // Merge with existing todos, avoiding duplicates
                    const existingIds = new Set(this.todos.map(t => t.id));
                    const newTodos = importedTodos.filter(t => !existingIds.has(t.id));
                    
                    this.todos = [...this.todos, ...newTodos];
                    this.saveTodos();
                    this.renderTodos();
                    this.updateStats();
                    
                    this.showNotification(`${newTodos.length} tasks imported successfully!`, 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showNotification('Error importing tasks. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const saved = localStorage.getItem('todos');
        if (saved) {
            try {
                this.todos = JSON.parse(saved);
            } catch (error) {
                console.error('Error loading todos:', error);
                this.todos = [];
            }
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || icons.info;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Add some sample data for demonstration (optional)
if (localStorage.getItem('todos') === null) {
    const sampleTodos = [
        {
            id: '1',
            text: 'Welcome to your Todo App!',
            completed: false,
            priority: 'high',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: '2',
            text: 'Click on tasks to select them for bulk actions',
            completed: false,
            priority: 'medium',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: '3',
            text: 'Use the search and filter features to organize your tasks',
            completed: true,
            priority: 'low',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('todos', JSON.stringify(sampleTodos));
}
