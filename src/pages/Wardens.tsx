import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, DollarSign } from 'lucide-react';
import { Warden } from '../types';
import { wardenAPI } from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const Wardens: React.FC = () => {
  const [wardens, setWardens] = useState<Warden[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarden, setEditingWarden] = useState<Warden | null>(null);
  const [searchPgId, setSearchPgId] = useState('');
  const [formData, setFormData] = useState({
    Name: '',
    Password: '',
    Email: '',
    Phno: '',
    Salary: '',
    Sal_status: false,
  });

  const resetForm = () => {
    setFormData({
      Name: '',
      Password: '',
      Email: '',
      Phno: '',
      Salary: '',
      Sal_status: false,
    });
    setEditingWarden(null);
  };

  const fetchAllWardens = async () => {
    setLoading(true);
    try {
      const response = await wardenAPI.getAll();
      setWardens(response.data);
    } catch (error) {
      console.error('Error fetching wardens:', error);
      alert('Error fetching wardens');
    } finally {
      setLoading(false);
    }
  };

  const fetchWardensByPG = async () => {
    if (!searchPgId) return;
    
    setLoading(true);
    try {
      const response = await wardenAPI.getByPG(parseInt(searchPgId));
      setWardens(response.data);
    } catch (error) {
      console.error('Error fetching wardens:', error);
      alert('Error fetching wardens');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        ...formData,
        Phno: parseInt(formData.Phno),
        Salary: parseInt(formData.Salary),
      };

      if (editingWarden) {
        await wardenAPI.update(editingWarden.UserId, data);
      } else {
        await wardenAPI.create(data);
      }
      
      setIsModalOpen(false);
      resetForm();
      // Refresh the list
      if (searchPgId) {
        await fetchWardensByPG();
      } else {
        await fetchAllWardens();
      }
    } catch (error) {
      console.error('Error saving warden:', error);
      alert('Error saving warden');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this warden?')) return;
    
    setLoading(true);
    try {
      await wardenAPI.delete(userId);
      setWardens(wardens.filter(warden => warden.UserId !== userId));
    } catch (error) {
      console.error('Error deleting warden:', error);
      alert('Error deleting warden');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSalaryStatus = async (userId: number, status: boolean) => {
    setLoading(true);
    try {
      await wardenAPI.updateSalaryStatus(userId, status);
      // Refresh the current list
      if (searchPgId) {
        await fetchWardensByPG();
      } else {
        await fetchAllWardens();
      }
    } catch (error) {
      console.error('Error updating salary status:', error);
      alert('Error updating salary status');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (warden: Warden) => {
    setEditingWarden(warden);
    setFormData({
      Name: warden.Name,
      Password: warden.Password,
      Email: warden.Email,
      Phno: warden.Phno.toString(),
      Salary: warden.Salary.toString(),
      Sal_status: warden.Sal_status,
    });
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchAllWardens();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wardens</h1>
        <button onClick={handleOpenModal} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Warden
        </button>
      </div>

      {/* Search Section */}
      <div className="card mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Search Wardens
        </h3>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Enter PG ID"
            value={searchPgId}
            onChange={(e) => setSearchPgId(e.target.value)}
            className="input-field flex-1"
          />
          <button onClick={fetchWardensByPG} className="btn-primary">
            <Search className="h-4 w-4 mr-2" />
            Search by PG
          </button>
          <button onClick={fetchAllWardens} className="btn-secondary">
            View All
          </button>
        </div>
      </div>

      {/* Wardens List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wardens.map((warden) => (
            <div key={warden.UserId} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {warden.Name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(warden)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(warden.UserId)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p><span className="font-medium">ID:</span> {warden.UserId}</p>
                <p><span className="font-medium">Email:</span> {warden.Email}</p>
                <p><span className="font-medium">Phone:</span> {warden.Phno}</p>
                <p><span className="font-medium">Salary:</span> ₹{warden.Salary}</p>
                <p>
                  <span className="font-medium">Salary Status:</span> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    warden.Sal_status 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {warden.Sal_status ? 'Paid' : 'Pending'}
                  </span>
                </p>
              </div>

              <button
                onClick={() => handleUpdateSalaryStatus(warden.UserId, !warden.Sal_status)}
                className="w-full btn-secondary text-sm"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Toggle Salary Status
              </button>
            </div>
          ))}
        </div>
      )}

      {wardens.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {searchPgId ? `No wardens found for PG ID: ${searchPgId}` : 'No wardens found'}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWarden ? 'Edit Warden' : 'Add New Warden'}
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
              value={formData.Email}
              onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.Phno}
                onChange={(e) => setFormData({ ...formData, Phno: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salary
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.Salary}
                onChange={(e) => setFormData({ ...formData, Salary: e.target.value })}
                className="input-field"
              />
            </div>
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
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sal_status"
              checked={formData.Sal_status}
              onChange={(e) => setFormData({ ...formData, Sal_status: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="sal_status" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Salary Paid
            </label>
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
              {loading ? 'Saving...' : editingWarden ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Wardens;