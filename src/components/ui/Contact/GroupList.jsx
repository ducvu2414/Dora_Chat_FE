import React from 'react';
import GroupCard from './GroupCard';

const GroupList = ({ groups }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
            {groups !== undefined && groups.map((group, index) => (
                <div key={index}>
                    <GroupCard group={group} />
                </div>
            ))}
        </div>
    );
};

export default GroupList;