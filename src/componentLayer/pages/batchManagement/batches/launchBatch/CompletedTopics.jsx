import React, { useState } from 'react';


const CompletedTopics = () => {
    const [isActive, setIsActive] = useState(false);

    const handleToggle = () => {
        setIsActive(!isActive);
    };

    return (
        <div>
            <div className="card">
                {/* toggel here */}
                <div className="">
                </div>
            </div>
        </div>
    )
}

export default CompletedTopics