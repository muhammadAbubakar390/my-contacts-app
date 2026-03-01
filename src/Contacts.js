import React, { useState, useEffect } from 'react';
import './Contacts.css';

const Contacts = () => {
  // Initial contacts data (your old contacts)
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
  const [apiContacts, setApiContacts] = useState([]);
  const [localContacts, setLocalContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [highlightedNames, setHighlightedNames] = useState([]);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    initials: ''
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContact, setEditedContact] = useState({});
  const [contactType, setContactType] = useState(''); // 'initial', 'local', or 'api'

  // Load contacts from localStorage and API
  useEffect(() => {
    // Load local storage contacts
    const storedContacts = JSON.parse(localStorage.getItem('customContacts')) || [];
    setLocalContacts(storedContacts);

    // Load API contacts
    fetchContacts();
  }, []);

  // Fetch contacts from API
  const fetchContacts = () => {
    fetch('http://localhost:5000/api/contacts')
      .then(response => response.json())
      .then(data => {
        console.log('API contacts loaded:', data);
        setApiContacts(data);
      })
      .catch(error => console.error('API fetch error:', error));
  };

  // Combine all contacts
  const allContacts = [
    ...initialContacts,
    ...localContacts,
    ...apiContacts
  ];
  
  useEffect(() => {
    console.log("Contacts updated:", allContacts);
  }, [apiContacts, localContacts]);

  // Get initials from first and last name
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
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

  // Handle form submission - save to localStorage
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new contact object
    const contactToAdd = {
      ...newContact,
      id: Date.now() // Using timestamp as temporary ID
    };

    // Update localStorage and state
    const stored = JSON.parse(localStorage.getItem('customContacts')) || [];
    const updatedContacts = [...stored, contactToAdd];
    localStorage.setItem('customContacts', JSON.stringify(updatedContacts));
    
    setLocalContacts(updatedContacts);
    setNewContact({ firstName: '', lastName: '', phone: '', initials: '' });
    setShowForm(false);
  };

  // Save old contacts to API
  const saveOldContactsToDB = async () => {
    try {
      for (const contact of initialContacts) {
        await fetch('http://localhost:5000/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${contact.firstName} ${contact.lastName}`,
            phone: contact.phone
          })
        });
        console.log(`Saved ${contact.firstName} to database`);
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      fetchContacts(); // Refresh to see all contacts
      alert('All old contacts saved to database!');
    } catch (error) {
      console.error('Error saving old contacts:', error);
    }
  };

  // Determine contact type and set appropriate state
  const detectContactType = (contact) => {
    if (initialContacts.some(c => c.id === contact.id)) {
      return 'initial';
    } else if (localContacts.some(c => c.id === contact.id)) {
      return 'local';
    } else if (apiContacts.some(c => c._id === contact._id)) {
      return 'api';
    }
    return 'unknown';
  };

  // Open details modal for a contact
  const openDetailsModal = (contact) => {
    setSelectedContact(contact);
    setEditedContact(contact);
    setShowDetailsModal(true);
    setEditMode(false);
    
    // Detect and set contact type
    const type = detectContactType(contact);
    setContactType(type);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedContact(null);
    setEditMode(false);
    setContactType('');
  };

  // Handle edit button click
  const handleEdit = () => {
    setEditMode(true);
  };

  // Handle input change in edit mode
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedContact(prev => ({ ...prev, [name]: value }));
  };

  // Update contact in API
  const updateApiContact = async (contactId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        fetchContacts(); // Refresh API contacts
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating API contact:', error);
      return false;
    }
  };

  // Delete contact from API
  const deleteApiContact = async (contactId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/contacts/${contactId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchContacts(); // Refresh API contacts
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting API contact:', error);
      return false;
    }
  };

  // Save edited contact
  const saveEditedContact = async () => {
    let success = false;
    
    if (contactType === 'local') {
      // Update in localStorage
      const updatedLocalContacts = localContacts.map(c => 
        c.id === selectedContact.id ? editedContact : c
      );
      localStorage.setItem('customContacts', JSON.stringify(updatedLocalContacts));
      setLocalContacts(updatedLocalContacts);
      success = true;
    } else if (contactType === 'api') {
      // Update in API
      const updatedData = {
        name: `${editedContact.firstName} ${editedContact.lastName}`,
        phone: editedContact.phone
      };
      success = await updateApiContact(selectedContact._id, updatedData);
    } else if (contactType === 'initial') {
      alert('Initial contacts cannot be edited. They are read-only.');
      return;
    }
    
    if (success) {
      setEditMode(false);
      setSelectedContact(editedContact);
    } else {
      alert('Failed to update contact. Please try again.');
    }
  };

  // Delete contact
  const deleteContact = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      let success = false;
      
      if (contactType === 'local') {
        // Delete from localStorage
        const updatedLocalContacts = localContacts.filter(c => c.id !== selectedContact.id);
        localStorage.setItem('customContacts', JSON.stringify(updatedLocalContacts));
        setLocalContacts(updatedLocalContacts);
        success = true;
      } else if (contactType === 'api') {
        // Delete from API
        success = await deleteApiContact(selectedContact._id);
      } else if (contactType === 'initial') {
        alert('Initial contacts cannot be deleted. They are read-only.');
        return;
      }
      
      if (success) {
        closeDetailsModal();
      } else {
        alert('Failed to delete contact. Please try again.');
      }
    }
  };

  return (
    <div className="contacts-app">
      <header>
        <h1>Contacts ({allContacts.length})</h1>
        <div className="header-buttons">
          <button 
            className="add-btn" 
            onClick={() => setShowForm(true)}
            style={{ display: showForm ? 'none' : 'block' }}
          >
            Add Contact
          </button>
          <button onClick={fetchContacts} className="refresh-btn">
            Refresh Contacts
          </button>
          <button onClick={saveOldContactsToDB} className="save-api-btn">
            Save to API
          </button>
        </div>
      </header>
      <main>
        {/* Contacts Grid */}
        {!showForm && (
          <div className="contacts-container">
            {allContacts.map(contact => (
              <div key={contact.id || contact._id} className="contact-card">
                <div 
                  className={`initials-container ${
                    (contact.id || contact._id) % 3 === 1 ? 'blue-gradient' : 
                    (contact.id || contact._id) % 3 === 2 ? 'red-gradient' : 'green-gradient'
                  }`}
                >
                  {contact.initials || getInitials(contact.firstName, contact.name?.split(' ')[0])}
                </div>
                <div className="contact-info">
                  <div 
                    className={`name clickable-name ${
                      highlightedNames.includes(contact.id || contact._id) ? 'name-highlight' : ''
                    }`}
                    onClick={() => toggleHighlight(contact.id || contact._id)}
                  >
                    {contact.firstName && contact.lastName 
                      ? `${contact.firstName} ${contact.lastName}`
                      : contact.name || 'Unnamed Contact'
                    }
                  </div>
                  <div className="phone">{contact.phone}</div>
                  <div className="contact-type">
                    {detectContactType(contact) === 'initial' && '(Read-only)'}
                    {detectContactType(contact) === 'api' && '(API)'}
                    {detectContactType(contact) === 'local' && '(Local)'}
                  </div>
                </div>
                <button 
                  className="details-btn"
                  onClick={() => openDetailsModal(contact)}
                >
                  Details
                </button>
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
                name="firstName"
                placeholder="First Name"
                value={newContact.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newContact.lastName}
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
              <div className="form-buttons">
                <button type="submit">Save to Local</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedContact && (
          <div className="modal-overlay" onClick={closeDetailsModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Contact Details</h2>
              <button className="close-modal" onClick={closeDetailsModal}>×</button>
              
              {contactType === 'initial' && (
                <div className="contact-type-notice">
                  This is a read-only initial contact. To edit, save it to API first.
                </div>
              )}
              
              {editMode ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>First Name:</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editedContact.firstName || ''}
                      onChange={handleEditChange}
                      disabled={contactType === 'initial'}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name:</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editedContact.lastName || ''}
                      onChange={handleEditChange}
                      disabled={contactType === 'initial'}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone:</label>
                    <input
                      type="text"
                      name="phone"
                      value={editedContact.phone || ''}
                      onChange={handleEditChange}
                      disabled={contactType === 'initial'}
                    />
                  </div>
                  <div className="modal-actions">
                    <button className="save-btn" onClick={saveEditedContact} 
                      disabled={contactType === 'initial'}>
                      Save
                    </button>
                    <button className="cancel-btn" onClick={() => setEditMode(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="details-view">
                  <div className="detail-item">
                    <strong>Name:</strong> {selectedContact.firstName} {selectedContact.lastName}
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong> {selectedContact.phone}
                  </div>
                  <div className="detail-item">
                    <strong>Type:</strong> {contactType}
                  </div>
                  <div className="modal-actions">
                    <button className="edit-btn" onClick={handleEdit}
                      disabled={contactType === 'initial'}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={deleteContact}
                      disabled={contactType === 'initial'}>
                      Delete
                    </button>
                    <button className="close-btn" onClick={closeDetailsModal}>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Contacts;