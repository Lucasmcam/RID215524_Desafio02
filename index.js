const renderTasksProgressData = (tasks) => {
    let TasksProgress;
    const TasksProgressDOM = document.getElementById('tasks-progress');

    if (TasksProgressDOM) TasksProgress = TasksProgressDOM;
    else {
        const newTasksProgressDOM = document.createElement('div');
        newTasksProgressDOM.id = 'tasks-progress';
        document.getElementsByTagName('footer')[0].appendChild(newTasksProgressDOM);
        TasksProgress = newTasksProgressDOM;
    }

    const DoneTasks = tasks.filter(({checked}) => checked).length;
    const TotalTasks = tasks.length;
    TasksProgress.textContent = `${DoneTasks}/${TotalTasks} tarefas concluídas`;
}


const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [];
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

const removeTask = (taskId) => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(({id}) => parseInt(id) !== parseInt(taskId));
    setTasksInLocalStorage(updatedTasks);
    renderTasksProgressData(updatedTasks);

    document
    .getElementById('todo-list')
    .removeChild(document.getElementById(taskId));
}

const removeDoneTasks = () => {
    const tasks = getTasksFromLocalStorage();
    const tasksToRemove = tasks
    .filter(({checked}) => checked)
    .map(({id}) => id);

    const updatedTasks = tasks.filter(({checked}) => !checked);
    setTasksInLocalStorage(updatedTasks);
    renderTasksProgressData(updatedTasks);

    tasksToRemove.forEach((tasksToRemove) => {
        document.getElementById('todo-list')
        .removeChild(document.getElementById(tasksToRemove))
})
}

const createTaskListItem = (task, checkbox) => {
    const list = document.getElementById('todo-list');
    const toDo = document.createElement('li');
    const removeTaskButton = document.createElement('button');
    removeTaskButton.textContent = 'x'; 
    removeTaskButton.ariaLabel = 'Remover tarefa';

    removeTaskButton.onclick = () => removeTask(task.id);

    toDo.id = task.id;
    toDo.appendChild(checkbox);
    list.appendChild(toDo);
    toDo.appendChild(removeTaskButton);

    return toDo;
}

const onCheckBoxClick = (event) => {
    const id = event.target.id.split('-')[0];
    const tasks = getTasksFromLocalStorage();

    const updatedTasks = tasks.map((task) => {
        return (parseInt(task.id) === parseInt(id)) ? { ...task, checked: event.target.checked }
             : task
    })
    setTasksInLocalStorage(updatedTasks);
    renderTasksProgressData(updatedTasks);

    const label = event.target.parentElement.querySelector('label');
    if (event.target.checked) {
        label.classList.add('concluida');
    } else {
        label.classList.remove('concluida');
    }
}

const getCheckBoxInput = ({id, description, checked}) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `${id}-checkbox`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId
    checkbox.checked = checked || false;
    checkbox.addEventListener('change', onCheckBoxClick);

    label.textContent = description;
    label.htmlFor = checkboxId;
    
    wrapper.className = 'checkbox-label-container';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    return wrapper;
}

const createTask = async (event) => {
    event.preventDefault();
    document.getElementById('save-task').setAttribute('disabled', true);

    const newTaskData = await getCreatedTaskInfo(event);
    const {id, description} = newTaskData;
    
    const checkbox = getCheckBoxInput(newTaskData);
    createTaskListItem(newTaskData, checkbox);

    const tasks = getTasksFromLocalStorage();

    const updatedTasks = [...tasks, { id, description, checked: false }];
    setTasksInLocalStorage(updatedTasks);
    renderTasksProgressData(updatedTasks);

    document.getElementById('description').value = '';
    document.getElementById('save-task').removeAttribute('disabled');
    
}

const getCreatedTaskInfo = (event) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(getNewTaskData(event));
    }, 3000)
})

const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage()
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1: 1;
}

const getNewTaskData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewTaskId();

    return { description, id};
}

window.onload = function() {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask);

    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
        const checkbox = getCheckBoxInput(task);
        createTaskListItem(task, checkbox);
    })

    if (checked) {
        checkbox.querySelector('label').classList.add('concluida');
    }

    renderTasksProgressData(tasks);
}
