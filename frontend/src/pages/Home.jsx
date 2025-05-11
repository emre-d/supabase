import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import CreateProject from '../components/CreateProject';
import GetProject from '../components/GetProject';

const Home = () => {
    const { user, loading } = useUser();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showCreateProject, setShowCreateProject] = useState(false);
    if (loading) {
        return <div>Loading...</div>;
    }

    const handleProjectCreated = () => {
        setRefreshTrigger(prev => prev + 1);
        setShowCreateProject(false);
    };

    return (
        <div>
            {user ? (
                <>
                    <button onClick={() => setShowCreateProject(!showCreateProject)} className='btn btn-primary'>Create</button>
                    {showCreateProject && (
                        <div className={`modal ${showCreateProject ? "modal-open" : ""}`}>
                            <div className="modal-box">
                                <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setShowCreateProject(!showCreateProject)}>✕</button>
                                </form>
                                <CreateProject onProjectCreated={handleProjectCreated} />
                            </div>
                      </div>
                    ) }
                    <GetProject key={refreshTrigger} />
                </>
            ) : (
                <h1>Please log in</h1>
            )}
        </div>
    );
};

export default Home;
