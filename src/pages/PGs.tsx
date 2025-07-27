import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, DollarSign, User } from 'lucide-react';
import { PG } from '../types';
import { pgAPI } from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const PGs: React.FC = () => {
  const [pgs, setPGs] = useState<PG[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isWardenModalOpen, setIsWardenModalOpen] = useState(false);
  const [editingPG, setEditingPG] = useState<PG | null>(null);
  const [selectedPG, setSelectedPG] = useState<PG | null>(null);
  const [searchOwnerId, setSearchOwnerId] = useState('');
  const [formData, setFormData] = useState({
    OwnerID: '',
    WardenID: '',
    Nofloors: '',
    Revenue: '',
    Name: '',
    Address: '',
    City: '',
  });
  const [revenueAmount, setRevenueAmount] = useState('');
  const [wardenId, setWardenId] = useState('');

  const resetForm = () => {
    setFormData({
      OwnerID: '',
      WardenID: '',
      Nofloors: '',
      Revenue: '',
      Name: '',
      Address: '',
      City: '',
    });
    setEditingPG(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        ...formData,
        OwnerID: parseInt(formData.OwnerID),
        WardenID: formData.WardenID ? parseInt(formData.WardenID) : undefined,
        Nofloors: parseInt(formData.Nofloors),
        Revenue: parseInt(formData.Revenue),
      };

      if (editingPG) {
        await pgAPI.updateDetails(editingPG.PGId, data);
      } else {
        await pgAPI.create(data);
      }
      
      setIsModalOpen(false);
      resetForm();
      if (searchOwnerId) {
        await fetchPGsByOwner();
      }
    } catch (error) {
      console.error('Error saving PG:', error);
      alert('Error saving PG');
    } finally {
      setLoading(false);
    }
  };

  const fetchPGsByOwner = async () => {
    if (!searchOwnerId) return;
    
    setLoading(true);
    try {
      const response = await pgAPI.getByOwner(parseInt(searchOwnerId));
      setPGs(response.data);
    } catch (error) {
      console.error('Error fetching PGs:', error);
      alert('Error fetching PGs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pgId: number) => {
    if (!confirm('Are you sure you want to delete this PG?')) return;
    
    setLoading(true);
    try {
      await pgAPI.delete(pgId);
      setPGs(pgs.filter(pg => pg.PGId !== pgId));
    } catch (error) {
      console.error('Error deleting PG:', error);
      alert('Error deleting PG');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pg: PG) => {
    setEditingPG(pg);
    setFormData({
      OwnerID: pg.OwnerID.toString(),
      WardenID: pg.WardenID?.toString() || '',
      Nofloors: pg.Nofloors.toString(),
      Revenue: pg.Revenue.toString(),
      Name: pg.Name,
      Address: pg.Address,
      City: pg.City,
    });
    setIsModalOpen(true);
  };

  const handleUpdateRevenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPG) return;
    
    setLoading(true);
    try {
      await pgAPI.updateRevenue(selectedPG.PGId, parseInt(revenueAmount));
      setIsRevenueModalOpen(false);
      setRevenueAmount('');
      if (searchOwnerId) {
        await fetchPGsByOwner();
      }
    } catch (error) {
      console.error('Error updating revenue:', error);
      alert('Error updating revenue');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWarden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPG) return;
    
    setLoading(true);
    try {
      await pgAPI.updateWarden(selectedPG.PGId, parseInt(wardenId));
      setIsWardenModalOpen(false);
      setWardenId('');
      if (searchOwnerId) {
        await fetchPGsByOwner();
      }
    } catch (error) {
      console.error('Error updating warden:', error);
      alert('Error updating warden');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PGs</h1>
        <button onClick={handleOpenModal} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add PG
        </button>
      </div>

      {/* Search Section */}
      <div className="card mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Search PGs by Owner
        </h3>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Enter Owner ID"
            value={searchOwnerId}
            onChange={(e) => setSearchOwnerId(e.target.value)}
            className="input-field flex-1"
          />
          <button onClick={fetchPGsByOwner} className="btn-primary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </button>
        </div>
      </div>

      {/* PGs List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pgs.map((pg) => (
            <div key={pg.PGId} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {pg.Name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(pg)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pg.PGId)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p><span className="font-medium">ID:</span> {pg.PGId}</p>
                <p><span className="font-medium">Address:</span> {pg.Address}</p>
                <p><span className="font-medium">City:</span> {pg.City}</p>
                <p><span className="font-medium">Floors:</span> {pg.Nofloors}</p>
                <p><span className="font-medium">Revenue:</span> ₹{pg.Revenue}</p>
                <p><span className="font-medium">Owner ID:</span> {pg.OwnerID}</p>
                {pg.WardenID && <p><span className="font-medium">Warden ID:</span> {pg.WardenID}</p>}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedPG(pg);
                    setRevenueAmount(pg.Revenue.toString());
                    setIsRevenueModalOpen(true);
                  }}
                  className="flex-1 btn-secondary text-xs"
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  Update Revenue
                </button>
                <button
                  onClick={() => {
                    setSelectedPG(pg);
                    setWardenId(pg.WardenID?.toString() || '');
                    setIsWardenModalOpen(true);
                  }}
                  className="flex-1 btn-secondary text-xs"
                >
                  <User className="h-3 w-3 mr-1" />
                  Update Warden
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pgs.length === 0 && !loading && searchOwnerId && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No PGs found for Owner ID: {searchOwnerId}
        </div>
      )}

      {/* Main Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPG ? 'Edit PG' : 'Add New PG'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Owner ID
              </label>
              <input
                type="number"
                required
                value={formData.OwnerID}
                onChange={(e) => setFormData({ ...formData, OwnerID: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Warden ID (Optional)
              </label>
              <input
                type="number"
                value={formData.WardenID}
                onChange={(e) => setFormData({ ...formData, WardenID: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          
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
              Address
            </label>
            <textarea
              required
              value={formData.Address}
              onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
              className="input-field"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={formData.City}
                onChange={(e) => setFormData({ ...formData, City: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Floors
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.Nofloors}
                onChange={(e) => setFormData({ ...formData, Nofloors: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Revenue
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.Revenue}
                onChange={(e) => setFormData({ ...formData, Revenue: e.target.value })}
                className="input-field"
              />
            </div>
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
              {loading ? 'Saving...' : editingPG ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Revenue Update Modal */}
      <Modal
        isOpen={isRevenueModalOpen}
        onClose={() => setIsRevenueModalOpen(false)}
        title="Update Revenue"
      >
        <form onSubmit={handleUpdateRevenue} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Revenue Amount
            </label>
            <input
              type="number"
              required
              min="0"
              value={revenueAmount}
              onChange={(e) => setRevenueAmount(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsRevenueModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Updating...' : 'Update Revenue'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Warden Update Modal */}
      <Modal
        isOpen={isWardenModalOpen}
        onClose={() => setIsWardenModalOpen(false)}
        title="Update Warden"
      >
        <form onSubmit={handleUpdateWarden} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Warden ID
            </label>
            <input
              type="number"
              required
              value={wardenId}
              onChange={(e) => setWardenId(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsWardenModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Updating...' : 'Update Warden'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PGs;