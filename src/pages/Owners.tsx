import React, { useState, useEffect } from 'react';
import { Plus, Edit, Search } from 'lucide-react';
import { Owner } from '../types';
import { ownerAPI } from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const Owners: React.FC = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [searchPgId, setSearchPgId] = useState('');
  const [formData, setFormData] = useState({
    Name: '',
    Password: '',
    phone: '',
    email: '',
  });

  const resetForm = () => {
    setFormData({
      Name: '',
      Password: '',
      phone: '',
      email: '',
    });
    setEditingOwner(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingOwner) {
        await ownerAPI.update(editingOwner.UserID, formData);
      } else {
        await ownerAPI.create(formData);
      }
      
      setIsModalOpen(false);
      resetForm();
      // Refresh the list if we have a PG ID
      if (searchPgId) {
        await fetchOwnersByPG();
      }
    } catch (error) {
      console.error('Error saving owner:', error);
      alert('Error saving owner');
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnersByPG = async () => {
    if (!searchPgId) return;
    
    setLoading(true);
    try {
      const response = await ownerAPI.getByPG(parseInt(searchPgId));
      setOwners(response.data);
    } catch (error) {
      console.error('Error fetching owners:', error);
      alert('Error fetching owners');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (owner: Owner) => {
    setEditingOwner(owner);
    setFormData({
      Name: owner.Name,
      Password: owner.Password,
      phone: owner.Phno.toString(),
      email: owner.Email,
    });
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Owners</h1>
        <button onClick={handleOpenModal} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Owner
        </button>
      </div>

      {/* Search Section */}
      <div className="card mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Search Owners by PG
        </h3>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Enter PG ID"
            value={searchPgId}
            onChange={(e) => setSearchPgId(e.target.value)}
            className="input-field flex-1"
          />
          <button onClick={fetchOwnersByPG} className="btn-primary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </button>
        </div>
      </div>

      {/* Owners List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {owners.map((owner) => (
            <div key={owner.UserID} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {owner.Name}
                </h3>
                <button
                  onClick={() => handleEdit(owner)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><span className="font-medium">ID:</span> {owner.UserID}</p>
                <p><span className="font-medium">Email:</span> {owner.Email}</p>
                <p><span className="font-medium">Phone:</span> {owner.Phno}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {owners.length === 0 && !loading && searchPgId && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No owners found for PG ID: {searchPgId}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOwner ? 'Edit Owner' : 'Add New Owner'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.Password}
              onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : editingOwner ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Owners;