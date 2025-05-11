import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

const GetProject = () => {
    const { user } = useUser();
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMyProjects, setShowMyProjects] = useState(false);

    const fetchProjects = async (pageNum = 1, reset = false) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8010/api/projects/?page=${pageNum}`);
            const newProjects = response.data.results || response.data; 
            setProjects((prev) => reset ? newProjects : [...prev, ...newProjects]);
            setFilteredProjects((prev) => reset ? newProjects : [...prev, ...newProjects]);
            setHasMore(!!response.data.next);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setHasMore(false);
        }
    };

    useEffect(() => {
        fetchProjects(1, true);
    }, []);

    useEffect(() => {
        let updatedProjects = projects;
        if (searchQuery) {
            updatedProjects = projects.filter(project =>
                project.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (showMyProjects) {
            updatedProjects = updatedProjects.filter(project => project.user === user.username);
        }
        setFilteredProjects(updatedProjects);
    }, [searchQuery, showMyProjects, projects, user.username]);

    const loadMore = () => {
        if (hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProjects(nextPage);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setShowMyProjects(false);
        setFilteredProjects(projects);
        document.getElementById('search').value = '';
    };

    const filterMyProjects = () => {
        setShowMyProjects(true);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Projects</h1>
            <div className='flex justify-center items-center gap-2 mb-2'>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder='Search'
                    className='input input-bordered w-full max-w-xs'
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <button className='btn btn-primary' onClick={resetFilters}>X</button>
                <button className='btn btn-primary' onClick={filterMyProjects}>My Projects</button>
            </div>

            <InfiniteScroll
                dataLength={filteredProjects.length}
                next={loadMore}
                hasMore={hasMore}
                endMessage={<p className="text-center py-4">No more projects to load.</p>}
            >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Project Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Members</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {project.members?.map((member, index) => (
                                            <div key={index}><a href="#" className='hover:underline'>{member}</a></div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default GetProject;