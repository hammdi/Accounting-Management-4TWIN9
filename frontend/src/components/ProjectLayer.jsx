// client/src/components/ProjectLayer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../services/authService';

const ProjectLayer = () => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'To Do',
        dueDate: '',
        priority: 'Medium'
    });
    const [showForm, setShowForm] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false); // For task form visibility

    const taskStatusOrder = ['To Do', 'In Progress', 'Done'];

    useEffect(() => {
        const fetchUserAndProjects = async () => {
            try {
                const userData = await getCurrentUser();
                if (userData) setUser(userData);

                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/projects/myprojects`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(data);
                if (data.length > 0) setSelectedProjectId(data[0]._id);
            } catch (err) {
                toast.error('Failed to fetch user or projects');
            }
        };
        fetchUserAndProjects();
    }, []);

    useEffect(() => {
        if (!selectedProjectId) return;
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/project/${selectedProjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(data);
            } catch (err) {
                toast.error('Failed to load tasks');
            }
        };
        fetchTasks();
    }, [selectedProjectId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = {
                name: formData.title,
                description: formData.description
            };
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/projects/addproject`, formDataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Project created!');
            setProjects(prev => [...prev, data.project]);
            setSelectedProjectId(data.project._id);
            setFormData({ title: '', description: '', status: 'To Do', dueDate: '', priority: 'Medium' });
            setShowForm(false);
        } catch (err) {
            toast.error('Failed to add project');
        }
    };

    const handleQuickAddTask = async (status) => {
        if (!selectedProjectId) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks/create`, {
                title: `New ${status} Task`,
                description: `Auto-created ${status} task`,
                status,
                dueDate: new Date().toISOString().split('T')[0],
                priority: 'Medium',
                project: selectedProjectId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(prev => [...prev, data.task]);
            toast.success(`${status} task created`);
        } catch (err) {
            toast.error('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(prev => prev.filter(task => task._id !== taskId));
            toast.success('Task deleted');
        } catch (err) {
            toast.error('Failed to delete task');
        }
    };

    const handleEditTask = async (taskId, updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(prev => prev.map(task => (task._id === taskId ? data.updatedTask : task)));
            toast.success('Task updated');
        } catch (err) {
            toast.error('Failed to update task');
        }
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProjectId) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks/create`, {
                title: formData.title,
                description: formData.description,
                status: formData.status,
                dueDate: formData.dueDate,
                priority: formData.priority,
                project: selectedProjectId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTasks(prev => [...prev, data.task]);
            toast.success('Task created');
            setFormData({ title: '', description: '', status: 'To Do', dueDate: '', priority: 'Medium' });
            setShowTaskForm(false);
        } catch (err) {
            toast.error('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Projects</h2>
                <button className="btn btn-outline-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Project'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleProjectSubmit} className="mb-4 border rounded p-3 bg-light">
                    <div className="mb-2">
                        <label>Title</label>
                        <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="mb-2">
                        <label>Description</label>
                        <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Create Project</button>
                </form>
            )}

            <div className="mb-4 overflow-auto">
                <ul className="nav nav-pills flex-nowrap gap-2" style={{ whiteSpace: 'nowrap', overflowX: 'auto' }}>
                    {projects.map(project => (
                        <li className="nav-item" key={project._id}>
                            <button className={`nav-link ${selectedProjectId === project._id ? 'active' : ''}`} onClick={() => setSelectedProjectId(project._id)}>
                                {project.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedProjectId ? (
                <>
                    <div className="mb-3">
                        <button className="btn btn-success" onClick={() => setShowTaskForm(!showTaskForm)}>
                            {showTaskForm ? 'Cancel' : '+ Add Custom Task'}
                        </button>
                    </div>

                    {showTaskForm && (
                        <form onSubmit={handleTaskSubmit} className="mb-4 border rounded p-3 bg-light">
                            <div className="mb-2">
                                <label>Title</label>
                                <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="mb-2">
                                <label>Description</label>
                                <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required />
                            </div>
                            <div className="mb-2">
                                <label>Status</label>
                                <select className="form-control" name="status" value={formData.status} onChange={handleChange} required>
                                    {taskStatusOrder.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label>Due Date</label>
                                <input type="date" className="form-control" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
                            </div>
                            <div className="mb-2">
                                <label>Priority</label>
                                <select className="form-control" name="priority" value={formData.priority} onChange={handleChange} required>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Create Task</button>
                        </form>
                    )}

                    <div className="d-flex gap-3 flex-wrap">
                        {taskStatusOrder.map(status => {
                            const tasksInStatus = tasks.filter(task => task.status === status);
                            return (
                                <div className="col-md-4" key={status}>
                                    <div className="card h-100 border shadow-sm">
                                        <div className="card-header d-flex justify-content-between align-items-center bg-light">
                                            <div>
                                                <h6 className="mb-0">{status}</h6>
                                                <small>{tasksInStatus.length} item(s)</small>
                                            </div>
                                            <button className="btn btn-sm btn-outline-success" onClick={() => handleQuickAddTask(status)} disabled={loading}>
                                                + New Task
                                            </button>
                                        </div>
                                        <div className="card-body">
                                            {tasksInStatus.length > 0 ? (
                                                tasksInStatus.map(task => (
                                                    <div key={task._id} className="mb-3 border rounded p-2">
                                                        <strong>{task.title}</strong>
                                                        <p className="small text-muted mb-1">{task.description}</p>
                                                        <small>Priority: {task.priority}</small>
                                                        <div className="d-flex gap-2 mt-2">
                                                            <button className="btn btn-warning btn-sm" onClick={() => handleEditTask(task._id, { status: status === 'To Do' ? 'In Progress' : 'Done' })}>Advance</button>
                                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-muted">No tasks in this category.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <p className="text-muted">No project selected or available.</p>
            )}
        </div>
    );
};

export default ProjectLayer;
