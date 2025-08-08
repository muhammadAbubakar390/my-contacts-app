import React, { useState, useEffect } from 'react';
import './Contacts.css';

const Contacts = () => {
  // Initial contacts data
  const initialContacts = [
    { id: 1, firstName: 'Ali', lastName: 'Ahmad', phone: '123-456-0000' },
    { id: 2, firstName: 'Javad', lastName: 'Ch', phone: '234-000-8000' },
    { id: 3, firstName: 'Riya', lastName: 'Ali', phone: '000-008-1000' },
    { id: 4, firstName: 'Ehsan', lastName: 'Haris', phone: '412-129-2301' },
    { id: 5, firstName: 'Maya', lastName: 'Anees', phone: '321-876-1002' },
    { id: 6, firstName: 'Sarah', lastName: 'Mubashir', phone: '656-241-2025' },
    { id: 7, firstName: 'Danial', lastName: 'Sheikh', phone: '579-452-3423' },
    { id: 8, firstName: 'Amjad', lastName: 'Wajih', phone: '650-167-3467' },
    { id: 9, firstName: 'Khadija', lastName: 'Yaseen', phone: '210-543-9876' }
  ];

  // State management
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [highlightedNames, setHighlightedNames] = useState([]);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    initials: ''
  });

  // Load contacts from localStorage on component mount
  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('customContacts')) || [];
    setContacts([...initialContacts, ...storedContacts]);
  }, []);

  // Get initials from first and last name
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Toggle name highlight
  const toggleHighlight = (id) => {
    setHighlightedNames(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Split full name if provided
    if (newContact.fullName) {
      const [firstName, ...rest] = newContact.fullName.split(' ');
      newContact.firstName = firstName;
      newContact.lastName = rest.join(' ') || '';
    }

    // Create new contact object
    const contactToAdd = {
      ...newContact,
      id: Date.now() // Using timestamp as temporary ID
    };

    // Update localStorage and state
    const stored = JSON.parse(localStorage.getItem('customContacts')) || [];
    const updatedContacts = [...stored, contactToAdd];
    localStorage.setItem('customContacts', JSON.stringify(updatedContacts));
    
    setContacts([...initialContacts, ...updatedContacts]);
    setNewContact({ firstName: '', lastName: '', phone: '', initials: '' });
    setShowForm(false);
  };

  return (
    <div className="contacts-app">
      <header>
        <h1>Contacts</h1>
        <button 
          className="add-btn" 
          onClick={() => setShowForm(true)}
          style={{ display: showForm ? 'none' : 'block' }}
        >
          Add Contact
        </button>
      </header>

      <main>
        {/* Contacts Grid */}
        {!showForm && (
          <div className="contacts-container">
            {contacts.map(contact => (
              <div key={contact.id} className="contact-card">
                <div 
                  className={`initials-container ${
                    contact.id % 3 === 1 ? 'blue-gradient' : 
                    contact.id % 3 === 2 ? 'red-gradient' : 'green-gradient'
                  }`}
                >
                  {contact.initials || getInitials(contact.firstName, contact.lastName)}
                </div>
                <div className="contact-info">
                  <div 
                    className={`name clickable-name ${
                      highlightedNames.includes(contact.id) ? 'name-highlight' : ''
                    }`}
                    onClick={() => toggleHighlight(contact.id)}
                  >
                    {`${contact.firstName} ${contact.lastName}`}
                  </div>
                  <div className="phone">{contact.phone}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Contact Form */}
        {showForm && (
          <div className="contact-form">
            <h2>Add New Contact</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name (e.g. Ali Ahmed)"
                value={newContact.fullName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="initials"
                placeholder="Initials (optional)"
                value={newContact.initials}
                onChange={handleInputChange}
                maxLength="2"
              />
              <button type="submit">Save</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Contacts;