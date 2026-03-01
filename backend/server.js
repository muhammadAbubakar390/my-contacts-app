const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Starting server...');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/contactsdb')
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    console.log('Database name:', mongoose.connection.db.databaseName);
  })
  .catch(error => console.error('MongoDB connection error:', error));

// Contact Schema and Model
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  initials: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  }
}, {
  timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

// ROUTES

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Contacts API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' });
});

// Debug info
app.get('/api/debug', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const contactCount = await Contact.countDocuments();

    res.json({
      database: db.databaseName,
      collections: collections.map(c => c.name),
      totalContacts: contactCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new contact
app.post('/api/contacts', async (req, res) => {
  try {
    const initials = req.body.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    const contact = new Contact({
      name: req.body.name,
      phone: req.body.phone,
      initials: initials
    });

    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a contact
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { name, phone } = req.body;
    const initials = name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase()
      : undefined;

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, phone, ...(initials && { initials }) },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(updatedContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});