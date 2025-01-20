import React from 'react';
import { ContactCard } from './ContactCard';

export function ContactList({ contacts }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
            {contacts.map((contact, index) => (
                <div key={index}>
                    <ContactCard contact={contact} />
                </div>
            ))}
        </div>
    );
}