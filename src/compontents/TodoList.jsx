import React, { useState, useEffect } from 'react';
import './todo.css';
import {
  CleaningServices,
  Work,
  ShoppingCart,
  School,
  Favorite
} from '@mui/icons-material';

function TodoList() {
  // جلب البيانات من localStorage أو استخدام القيم الافتراضية
  const loadTasksFromStorage = () => {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    // القيم الافتراضية إذا لم تكن هناك بيانات محفوظة
    return [
      { id: 1, name: 'Do the dishes', completed: false, category: 'Cleaning' },
      { id: 2, name: 'Do the dishes', completed: false, category: 'Cleaning' },
      { id: 3, name: 'Do the dishes', completed: false, category: 'Cleaning' },
      { id: 4, name: 'Prepare presentation', completed: false, category: 'Work' },
      { id: 5, name: 'Buy groceries', completed: false, category: 'Errands' },
      { id: 6, name: 'Read React documentation', completed: false, category: 'Learning' },
      { id: 7, name: 'Morning exercise', completed: false, category: 'Health' }
    ];
  };

  const loadSelectedCategoryFromStorage = () => {
    const savedCategory = localStorage.getItem('selectedCategory');
    return savedCategory || 'Cleaning';
  };

  const [tasks, setTasks] = useState(loadTasksFromStorage());
  const [selectedCategory, setSelectedCategory] = useState(loadSelectedCategoryFromStorage());
 
  const [newTask, setNewTask] = useState({
    name: '',
    category: 'Cleaning'
  });
 
  const categories = [
    { name: 'Cleaning', icon: <CleaningServices fontSize="large" /> },
    { name: 'Work', icon: <Work fontSize="large" /> },
    { name: 'Errands', icon: <ShoppingCart fontSize="large" /> },
    { name: 'Learning', icon: <School fontSize="large" /> },
    { name: 'Health', icon: <Favorite fontSize="large" /> }
  ];

  // حفظ البيانات في localStorage عند كل تغيير
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    console.log('Tasks saved to localStorage:', tasks);
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory);
    console.log('Category saved to localStorage:', selectedCategory);
  }, [selectedCategory]);

  // حساب المهام المكتملة
  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = tasks.length > 0
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  // فلترة المهام حسب الفئة المختارة
  const filteredTasks = tasks.filter(task => task.category === selectedCategory);

  const handleTaskToggle = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    if (newTask.name.trim() === '') {
      alert('Please enter a task name');
      return;
    }
   
    const newTaskObj = {
      id: Date.now(),
      name: newTask.name,
      completed: false,
      category: newTask.category
    };
   
    const updatedTasks = [...tasks, newTaskObj];
    setTasks(updatedTasks);
    setNewTask({ name: '', category: 'Cleaning' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  // دالة لحذف المهمة
  const handleDeleteTask = (id, e) => {
    e.stopPropagation(); // لمنع تنفيذ الأحداث الأخرى
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  // دالة لمسح جميع المهام
  const handleClearAllTasks = () => {
    if (window.confirm('Are you sure you want to delete all tasks?')) {
      setTasks([]);
    }
  };

  return (
    <div className="todo-container">
      <h1>Simple TodoList</h1>
     <div className="container1">
<section className="task-section">
        <div className="section-header">
          <h2>List of {selectedCategory} Tasks</h2>
          <button
            onClick={handleClearAllTasks}
            className="clear-all-btn"
            title="Clear all tasks"
          >
            Clear All
          </button>
        </div>
       
        <div className="task-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskToggle(task.id)}
                    className="task-checkbox"
                  />
                  <span className={`task-name ${task.completed ? 'completed' : ''}`}>
                    {task.name}
                  </span>
                </div>
                <button
                  onClick={(e) => handleDeleteTask(task.id, e)}
                  className="delete-task-btn"
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <div className="no-tasks">
              No tasks in {selectedCategory} category. Add some!
            </div>
          )}
        </div>
      </section>
     
      <hr className="divider" />
     <div className="container2">
<section className="progress-section">
        <h2>Today's Progress</h2>
        <div className="progress-display">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="progress-text">{progressPercentage}%</span>
          <span className="tasks-count">
            ({completedTasks}/{tasks.length} completed)
          </span>
        </div>
      </section>
     
      <section className="add-task-section">
        <h2>Add New Task</h2>
        <div className="input-group">
          <div className="input-row">
            <label>Task Name:</label>
            <input
              type="text"
              value={newTask.name}
              onChange={(e) => setNewTask({...newTask, name: e.target.value})}
              onKeyPress={handleKeyPress}
              placeholder="Enter task name"
              className="task-input"
            />
          </div>
          <div className="input-row">
            <label>Category:</label>
            <select
              value={newTask.category}
              onChange={(e) => setNewTask({...newTask, category: e.target.value})}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleAddTask} className="add-button">
         Add
        </button>
      </section>
     </div>
      
     </div>
      
     
      <section className="buttons-section">
       
        <div className="icon-buttons-container">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`icon-button ${selectedCategory === category.name ? 'active' : ''}`}
              title={category.name}
            >
              <div className={`icon-wrapper ${selectedCategory === category.name ? 'active' : ''}`}>
                {category.icon}
              </div>
              <span className="icon-label">{category.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TodoList;