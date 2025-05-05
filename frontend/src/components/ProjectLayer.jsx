import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../services/authService';

const ProjectLayer = () => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'To Do',
        dueDate: '',
        priority: 'Medium'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const taskStatusOrder = ['To Do', 'In Progress', 'Done'];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                if (userData) setUser(userData);
            } catch (err) {
                toast.error('Failed to fetch user data');
            }
        };

        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/projects/myprojects`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(data);
                if (data.length > 0) setSelectedProjectId(data[0]._id);
            } catch (err) {
                toast.error('Failed to load projects');
            }
        };

        fetchUser();
        fetchProjects();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const formDataToSend = {
                name: formData.title,
                description: formData.description,
                status: formData.status,
                dueDate: formData.dueDate,
                priority: formData.priority
            };

            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/projects/addproject`,
                formDataToSend,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Project created!');
            setProjects([...projects, data.project]);
            setFormData({
                title: '',
                description: '',
                status: 'To Do',
                dueDate: '',
                priority: 'Medium'
            });
            setShowForm(false);
            setSelectedProjectId(data.project._id); // Auto-select new project
        } catch (err) {
            setError(err.response?.data?.error || 'Error creating project');
            toast.error('Project creation failed');
        } finally {
            setLoading(false);
        }
    };

    const selectedProject = projects.find(p => p._id === selectedProjectId);

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Projects</h2>
                <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'New Project'}
                </button>
            </div>



            {/* Add project form */}
            {showForm && (
                <div className="card p-4 mb-4 shadow-sm">
                    <h5>Create New Project</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Project Title"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Project Description"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                        <button
                            type="submit"
                            className="btn btn-primary mt-3"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </form>
                </div>
            )}

            
            {/* Tabs for project titles */}
            <div className="mb-4 overflow-auto">
    <ul className="nav nav-pills flex-nowrap gap-2" style={{ whiteSpace: 'nowrap', overflowX: 'auto' }}>
        {projects.map((project) => (
            <li className="nav-item" key={project._id}>
                <button
                    className={`nav-link ${selectedProjectId === project._id ? 'active' : ''}`}
                    onClick={() => setSelectedProjectId(project._id)}
                >
                    {project.name}
                </button>
            </li>
        ))}
    </ul>
            </div>

            {/* Kanban board for selected project */}
            {selectedProject ? (
                <div className="d-flex">
                    {taskStatusOrder.map((status) => {
                        const tasksInStatus = (selectedProject.tasks || []).filter(task => task.status === status);

                        return (
                            <div className="col-md-4 mb-4" key={status}>
                                <div className="card h-100 border">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0">{status}</h6>
                                        <small>{tasksInStatus.length} item(s)</small>
                                    </div>
                                    <div className="card-body">
                                        {tasksInStatus.length > 0 ? (
                                            tasksInStatus.map(task => (
                                                <div key={task._id} className="mb-3 border rounded p-2">
                                                    <strong>{task.title}</strong>
                                                    <p className="small text-muted mb-1">{task.description}</p>
                                                    <small>Priority: {task.priority}</small>
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
            ) : (
                <p className="text-muted">No project selected or available.</p>
            )}
        </div>
    );
};

export default ProjectLayer;
