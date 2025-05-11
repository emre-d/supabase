import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const CreateProject = ({ onProjectCreated }) => {
    const { user } = useUser();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState(null);

    if (!user) {
        return <div>Please log in to create a project</div>;
    }

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://127.0.0.1:8010/api/projects/`, {
                name,
                description,
                user: user.id,
                members: selectedUsers
            });
            setName('');
            setDescription('');
            setSelectedUsers([]);            
            onProjectCreated();
        } catch (error) {
            console.error('Error creating project:', error);
            setError('Failed to create project. Please try again.');
        }
    }

    const getUsers = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8010/api/users/`);
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else if (response.data && Array.isArray(response.data.results)) {
                setUsers(response.data.results);
            } else {
                console.error('Unexpected API response format:', response.data);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users. Please try again.');
            setUsers([]);
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    const handleUserChange = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create Project</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <input 
                        type="text" 
                        id="name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter project name"
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input 
                        type="text" 
                        id="description"
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter project description"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Team Members</label>
                    <div className="border border-gray-300 rounded-md p-4 max-h-[200px] overflow-y-auto">
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <div key={user.id} className="flex items-center space-x-2 py-2">
                                    <input
                                        type="checkbox"
                                        id={`user-${user.id}`}
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleUserChange(user.id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor={`user-${user.id}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                    >
                                        {user.username}
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No users available</p>
                        )}
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Create Project
                </button>
            </form>
        </div>
    );
};

export default CreateProject;