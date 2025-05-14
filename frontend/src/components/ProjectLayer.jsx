import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../services/authService';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ProjectLayer = () => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        title: '',
        status: 'To Do',
        dueDate: '',
        priority: 'Medium'
    });
    const [showForm, setShowForm] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const taskStatusOrder = ['To Do', 'In Progress', 'Done'];

    // Fetch user and projects on component mount
    useEffect(() => {
        const fetchUserAndProjects = async () => {
            try {
                const userData = await getCurrentUser();
                if (userData) setUser(userData);

                const token = localStorage.getItem('token');
                const { data } = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/projects/myprojects`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProjects(data);
                if (data.length > 0 && !selectedProject) {
                    setSelectedProject(data[0]);
                }
            } catch (err) {
                toast.error('Failed to fetch user or projects');
            }
        };
        fetchUserAndProjects();
    }, []);

    // Fetch tasks when selected project changes
    useEffect(() => {
        const fetchTasks = async () => {
            if (!selectedProject) {
                setTasks([]);
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/tasks/project/${selectedProject._id}`,
                    { 
                        headers: { Authorization: `Bearer ${token}` } 
                    }
                );
                setTasks(data);
            } catch (err) {
                toast.error('Failed to load tasks');
            }
        };
        fetchTasks();
    }, [selectedProject]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTaskEditChange = (e, taskId) => {
        const { name, value } = e.target;
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task._id === taskId ? { ...task, [name]: value } : task
            )
        );
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/projects`,
                {
                    name: formData.name,
                    description: formData.description
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Project created!');
            setProjects(prev => [...prev, data.project]);
            setSelectedProject(data.project);
            setFormData({ 
                name: '', 
                description: '', 
                title: '',
                status: 'To Do', 
                dueDate: '', 
                priority: 'Medium' 
            });
            setShowForm(false);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add project');
        }
    };

    const handleProjectUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/projects/${selectedProject._id}`,
                {
                    name: formData.name,
                    description: formData.description
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Project updated!');
            setProjects(prev => prev.map(p => p._id === selectedProject._id ? data.updated : p));
            setSelectedProject(data.updated);
            setEditMode(false);
            setFormData({ 
                name: '', 
                description: '', 
                title: '',
                status: 'To Do', 
                dueDate: '', 
                priority: 'Medium' 
            });
            setShowForm(false);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update project');
        }
    };

    const handleDeleteProject = async () => {
        if (!selectedProject) return;
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/projects/${selectedProject._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Project deleted!');
            const updatedProjects = projects.filter(p => p._id !== selectedProject._id);
            setProjects(updatedProjects);
            setSelectedProject(updatedProjects.length > 0 ? updatedProjects[0] : null);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete project');
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
        setShowForm(true);
        setFormData({
            name: selectedProject.name,
            description: selectedProject.description,
            title: '',
            status: 'To Do',
            dueDate: '',
            priority: 'Medium'
        });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setShowForm(false);
        setFormData({ 
            name: '', 
            description: '', 
            title: '',
            status: 'To Do', 
            dueDate: '', 
            priority: 'Medium' 
        });
    };

    const handleQuickAddTask = async (status) => {
        if (!selectedProject || !user) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/tasks/create`,
                {
                    title: `New ${status} Task`,
                    description: `Auto-created ${status} task`,
                    status,
                    dueDate: new Date().toISOString().split('T')[0],
                    priority: 'Medium',
                    project: selectedProject._id,
                    assignedTo: user._id
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(prev => [...prev, data.task]);
            toast.success(`${status} task created`);
        } catch (err) {
            toast.error('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProject || !user) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/tasks/create`,
                {
                    title: formData.title,
                    description: formData.description,
                    status: formData.status,
                    dueDate: formData.dueDate,
                    priority: formData.priority,
                    project: selectedProject._id,
                    assignedTo: user._id
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(prev => [...prev, data.task]);
            toast.success('Task created');
            setFormData({ 
                name: '',
                description: '',
                title: '', 
                description: '', 
                status: 'To Do', 
                dueDate: '', 
                priority: 'Medium' 
            });
            setShowTaskForm(false);
        } catch (err) {
            toast.error('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(prev => prev.filter(task => task._id !== taskId));
            toast.success('Task deleted');
        } catch (err) {
            toast.error('Failed to delete task');
        }
    };

    const handleEditTask = (taskId) => {
        setEditingTask(taskId);
    };

    const handleCancelTaskEdit = () => {
        setEditingTask(null);
    };

    const handleSaveTask = async (taskId) => {
        try {
            const taskToUpdate = tasks.find(task => task._id === taskId);
            if (!taskToUpdate) return;

            const token = localStorage.getItem('token');
            const { data } = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
                {
                    title: taskToUpdate.title,
                    description: taskToUpdate.description,
                    status: taskToUpdate.status,
                    dueDate: taskToUpdate.dueDate,
                    priority: taskToUpdate.priority
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTasks(prev => prev.map(task => 
                task._id === taskId ? data.updatedTask : task
            ));
            setEditingTask(null);
            toast.success('Task updated');
        } catch (err) {
            toast.error('Failed to update task');
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
    
        // If no destination, do nothing
        if (!destination) return;
        
        // If dropped in the same place, do nothing
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
        // Create a copy of current tasks
        const updatedTasks = [...tasks];
        const taskToUpdate = updatedTasks.find(task => task._id === draggableId);
        
        if (!taskToUpdate) return;
    
        // Store original task for rollback
        const originalTask = {...taskToUpdate};
    
        // Moving within same column (reordering)
        if (destination.droppableId === source.droppableId) {
            const [removed] = updatedTasks.splice(source.index, 1);
            updatedTasks.splice(destination.index, 0, removed);
            setTasks(updatedTasks);
            return;
        }
    
        // Column change (status update)
        try {
            // Optimistically update UI
            taskToUpdate.status = destination.droppableId;
            setTasks(updatedTasks);
    
            const token = localStorage.getItem('token');
            const { data } = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/tasks/${draggableId}`,
                {
                    status: destination.droppableId // Only send the status field
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // Update with server response
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task._id === draggableId ? { ...task, ...data.updatedTask } : task
                )
            );
            
            toast.success('Task status updated');
        } catch (err) {
            console.error('Drag and drop error:', err);
            // Revert to original state
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task._id === draggableId ? originalTask : task
                )
            );
            toast.error('Failed to update task status');
        }
    };

    const getTasksByStatus = (status) => {
        return tasks
            .filter(task => task.status === status)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Projects</h2>
                <button 
                    className="btn btn-outline-primary" 
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditMode(false);
                        setFormData({
                            name: '',
                            description: '',
                            title: '',
                            status: 'To Do',
                            dueDate: '',
                            priority: 'Medium'
                        });
                    }}
                >
                    {showForm ? 'Cancel' : '+ Add Project'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={editMode ? handleProjectUpdate : handleProjectSubmit} className="mb-4 border rounded p-3 bg-light">
                    <div className="mb-3">
                        <label className="form-label">Project Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="name"  
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea 
                            className="form-control" 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            {editMode ? 'Update Project' : 'Create Project'}
                        </button>
                        {editMode && (
                            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            )}

            <div className="mb-4">
                <ul className="nav nav-pills flex-nowrap gap-2" style={{ overflowX: 'auto' }}>
                    {projects.map(project => (
                        <li className="nav-item" key={project._id}>
                            <button 
                                className={`nav-link ${selectedProject?._id === project._id ? 'active' : ''}`} 
                                onClick={() => setSelectedProject(project)}
                            >
                                {project.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedProject && (
                <>
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="card-title">{selectedProject.name}</h4>
                                <div className="btn-group">
                                    <button 
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={handleEditClick}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={handleDeleteProject}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className="card-text">{selectedProject.description}</p>
                        </div>
                    </div>

                    <div className="mb-3">
                        <button 
                            className="btn btn-success" 
                            onClick={() => {
                                setShowTaskForm(!showTaskForm);
                                setFormData({
                                    name: '',
                                    description: '',
                                    title: '',
                                    status: 'To Do',
                                    dueDate: '',
                                    priority: 'Medium'
                                });
                            }}
                        >
                            {showTaskForm ? 'Cancel' : '+ Add Custom Task'}
                        </button>
                    </div>

                    {showTaskForm && (
                        <form onSubmit={handleTaskSubmit} className="mb-4 border rounded p-3 bg-light">
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea 
                                    className="form-control" 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select 
                                    className="form-select" 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange} 
                                    required
                                >
                                    {taskStatusOrder.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Due Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    name="dueDate" 
                                    value={formData.dueDate} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Priority</label>
                                <select 
                                    className="form-select" 
                                    name="priority" 
                                    value={formData.priority} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Create Task
                            </button>
                        </form>
                    )}

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="row g-3">
                            {taskStatusOrder.map(status => {
                                const tasksInStatus = getTasksByStatus(status);
                                return (
                                    <div className="col-md-4" key={status}>
                                        <div className="card h-100 border shadow-sm">
                                            <div className="card-header d-flex justify-content-between align-items-center bg-light">
                                                <div>
                                                    <h6 className="mb-0">{status}</h6>
                                                    <small className="text-muted">
                                                        {tasksInStatus.length} {tasksInStatus.length === 1 ? 'task' : 'tasks'}
                                                    </small>
                                                </div>
                                                <button 
                                                    className="btn btn-sm btn-outline-success" 
                                                    onClick={() => handleQuickAddTask(status)} 
                                                    disabled={loading}
                                                >
                                                    + Quick Add
                                                </button>
                                            </div>
                                            <Droppable droppableId={status}>
                                                {(provided) => (
                                                    <div 
                                                        className="card-body"
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                        style={{ minHeight: '100px' }}
                                                    >
                                                        {tasksInStatus.length > 0 ? (
                                                            <div className="d-grid gap-2">
                                                                {tasksInStatus.map((task, index) => (
                                                                    <Draggable 
                                                                        key={task._id} 
                                                                        draggableId={task._id} 
                                                                        index={index}
                                                                    >
                                                                        {(provided) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                className="border rounded p-3 bg-white"
                                                                            >
                                                                                {editingTask === task._id ? (
                                                                                    <>
                                                                                        <div className="mb-3">
                                                                                            <label className="form-label">Title</label>
                                                                                            <input 
                                                                                                type="text" 
                                                                                                className="form-control" 
                                                                                                name="title" 
                                                                                                value={task.title} 
                                                                                                onChange={(e) => handleTaskEditChange(e, task._id)} 
                                                                                                required 
                                                                                            />
                                                                                        </div>
                                                                                        <div className="mb-3">
                                                                                            <label className="form-label">Description</label>
                                                                                            <textarea 
                                                                                                className="form-control" 
                                                                                                name="description" 
                                                                                                value={task.description} 
                                                                                                onChange={(e) => handleTaskEditChange(e, task._id)} 
                                                                                                required 
                                                                                            />
                                                                                        </div>
                                                                                        <div className="mb-3">
                                                                                            <label className="form-label">Status</label>
                                                                                            <select 
                                                                                                className="form-select" 
                                                                                                name="status" 
                                                                                                value={task.status} 
                                                                                                onChange={(e) => handleTaskEditChange(e, task._id)} 
                                                                                                required
                                                                                            >
                                                                                                {taskStatusOrder.map(status => (
                                                                                                    <option key={status} value={status}>{status}</option>
                                                                                                ))}
                                                                                            </select>
                                                                                        </div>
                                                                                        <div className="mb-3">
                                                                                            <label className="form-label">Due Date</label>
                                                                                            <input 
                                                                                                type="date" 
                                                                                                className="form-control" 
                                                                                                name="dueDate" 
                                                                                                value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''} 
                                                                                                onChange={(e) => handleTaskEditChange(e, task._id)} 
                                                                                                required 
                                                                                            />
                                                                                        </div>
                                                                                        <div className="mb-3">
                                                                                            <label className="form-label">Priority</label>
                                                                                            <select 
                                                                                                className="form-select" 
                                                                                                name="priority" 
                                                                                                value={task.priority} 
                                                                                                onChange={(e) => handleTaskEditChange(e, task._id)} 
                                                                                                required
                                                                                            >
                                                                                                <option value="Low">Low</option>
                                                                                                <option value="Medium">Medium</option>
                                                                                                <option value="High">High</option>
                                                                                            </select>
                                                                                        </div>
                                                                                        <div className="d-flex gap-2">
                                                                                            <button 
                                                                                                type="button" 
                                                                                                className="btn btn-primary" 
                                                                                                onClick={() => handleSaveTask(task._id)}
                                                                                            >
                                                                                                Save
                                                                                            </button>
                                                                                            <button 
                                                                                                type="button" 
                                                                                                className="btn btn-secondary" 
                                                                                                onClick={handleCancelTaskEdit}
                                                                                            >
                                                                                                Cancel
                                                                                            </button>
                                                                                        </div>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <h6 className="mb-1">{task.title}</h6>
                                                                                        <p className="small text-muted mb-2">{task.description}</p>
                                                                                        <div className="d-flex justify-content-between mb-2">
                                                                                            <small className="text-muted">
                                                                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                                                                            </small>
                                                                                            <small className="text-muted">
                                                                                                Assigned: {task.assignedTo?.name || 'You'}
                                                                                            </small>
                                                                                        </div>
                                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                                            <span className={`badge bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'}`}>
                                                                                                {task.priority}
                                                                                            </span>
                                                                                            <div className="btn-group btn-group-sm">
                                                                                                <button 
                                                                                                    className="btn btn-outline-warning" 
                                                                                                    onClick={() => handleEditTask(task._id)}
                                                                                                >
                                                                                                    Edit
                                                                                                </button>
                                                                                                <button 
                                                                                                    className="btn btn-outline-danger" 
                                                                                                    onClick={() => handleDeleteTask(task._id)}
                                                                                                >
                                                                                                    Delete
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-4">
                                                                <p className="text-muted">No tasks in this status</p>
                                                                <button 
                                                                    className="btn btn-sm btn-outline-primary" 
                                                                    onClick={() => handleQuickAddTask(status)}
                                                                >
                                                                    Add Sample Task
                                                                </button>
                                                            </div>
                                                        )}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </DragDropContext>
                </>
            )}
        </div>
    );
};

export default ProjectLayer;