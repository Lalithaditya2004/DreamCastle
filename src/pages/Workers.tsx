import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, DollarSign } from 'lucide-react';
import { Worker } from '../types';
import { workerAPI } from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const Workers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [searchParams, setSearchParams] = useState({
    pgId: '',
    job: '',
  });
  const [formData, setFormData] = useState({
    Name: '',
    Phno: '',
    Salary: '',
    Sal_status: false,
    Job: '',
    ReportsTo: '',
    AadharId: '',
    PGId: '',
  });

  const resetForm = () => {
    setFormData({
      Name: '',
      Phno: '',
      Salary: '',
      Sal_status: false,
      Job: '',
      ReportsTo: '',
      AadharId: '',
      PGId: '',
    });
    setEditingWorker(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        ...formData,
        Phno: parseInt(formData.Phno),
        Salary: parseInt(formData.Salary),
        ReportsTo: formData.ReportsTo ? parseInt(formData.ReportsTo) : undefined,
        AadharId: parseInt(formData.AadharId),
        PGId: parseInt(formData.PGId),
      };

      if (editingWorker) {
        await workerAPI.update(editingWorker.AadharId, data);
      } else {
        await workerAPI.create(data);
      }
      
      setIsModalOpen(false);
      resetForm();
      // Refresh the list if we have search params
      if (searchParams.pgId) {
        if (searchParams.job) {
          await fetchWorkersByJob();
        } else {
          await fetchWorkersByPG();
        }
      }
    } catch (error) {
      console.error('Error saving worker:', error);
      alert('Error saving worker');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkersByPG = async () => {
    if (!searchParams.pgId) return;
    
    setLoading(true);
    try {
      const response = await workerAPI.getByPG(parseInt(searchParams.pgId));
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
      alert('Error fetching workers');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkersByJob = async () => {
    if (!searchParams.pgId || !searchParams.job) return;
    
    setLoading(true);
    try {
      const response = await workerAPI.getByJob(parseInt(searchParams.pgId), searchParams.job);
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
      alert('Error fetching workers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (aadharId: number) => {
    if (!confirm('Are you sure you want to delete this worker?')) return;
    
    setLoading(true);
    try {
      await workerAPI.delete(aadharId);
      setWorkers(workers.filter(worker => worker.AadharId !== aadharId));
    } catch (error) {
      console.error('Error deleting worker:', error);
      alert('Error deleting worker');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSalaryStatus = async (aadharId: number, status: boolean) => {
    setLoading(true);
    try {
      await workerAPI.updateSalaryStatus(aadharId, status);
      // Refresh the current list
      if (searchParams.pgId) {
        if (searchParams.job) {
          await fetchWorkersByJob();
        } else {
          await fetchWorkersByPG();
        }
      }
    } catch (error) {
      console.error('Error updating salary status:', error);
      alert('Error updating salary status');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setFormData({
      Name: worker.Name || worker.WorkerName || '',
      Phno: worker.Phno.toString(),
      Salary: worker.Salary.toString(),
      Sal_status: worker.Sal_status,
      Job: worker.Job,
      ReportsTo: worker.ReportsTo?.toString() || '',
      AadharId: worker.AadharId.toString(),
      PGId: '', // This would need to be tracked separately
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workers</h1>
        <button onClick={handleOpenModal} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Worker
        </button>
      </div>

      {/* Search Section */}
      <div className="card mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Search Workers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            placeholder="PG ID"
            value={searchParams.pgId}
            onChange={(e) => setSearchParams({ ...searchParams, pgId: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Job Title (Optional)"
            value={searchParams.job}
            onChange={(e) => setSearchParams({ ...searchParams, job: e.target.value })}
            className="input-field"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={fetchWorkersByPG} className="btn-primary">
            <Search className="h-4 w-4 mr-2" />
            Search by PG
          </button>
          <button onClick={fetchWorkersByJob} className="btn-secondary">
            Search by Job
          </button>
        </div>
      </div>

      {/* Workers List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workers.map((worker) => (
            <div key={worker.AadharId} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {worker.Name || worker.WorkerName}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(worker)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(worker.AadharId)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p><span className="font-medium">Aadhar ID:</span> {worker.AadharId}</p>
                <p><span className="font-medium">Phone:</span> {worker.Phno}</p>
                <p><span className="font-medium">Job:</span> {worker.Job}</p>
                <p><span className="font-medium">Salary:</span> ₹{worker.Salary}</p>
                {worker.ReportsTo && (
                  <p><span className="font-medium">Reports To:</span> {worker.ReportsTo}</p>
                )}
                <p>
                  <span className="font-medium">Salary Status:</span> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    worker.Sal_status 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {worker.Sal_status ? 'Paid' : 'Pending'}
                  </span>
                </p>
              </div>

              <button
                onClick={() => handleUpdateSalaryStatus(worker.AadharId, !worker.Sal_status)}
                className="w-full btn-secondary text-sm"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Toggle Salary Status
              </button>
            </div>
          ))}
        </div>
      )}

      {workers.length === 0 && !loading && searchParams.pgId && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No workers found with the specified criteria
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWorker ? 'Edit Worker' : 'Add New Worker'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Aadhar ID
              </label>
              <input
                type="number"
                required
                value={formData.AadharId}
                onChange={(e) => setFormData({ ...formData, AadharId: e.target.value })}
                className="input-field"
                disabled={!!editingWorker}
              />
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
                Job Title
              </label>
              <input
                type="text"
                required
                value={formData.Job}
                onChange={(e) => setFormData({ ...formData, Job: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                PG ID
              </label>
              <input
                type="number"
                required
                value={formData.PGId}
                onChange={(e) => setFormData({ ...formData, PGId: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reports To (Warden ID - Optional)
            </label>
            <input
              type="number"
              value={formData.ReportsTo}
              onChange={(e) => setFormData({ ...formData, ReportsTo: e.target.value })}
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
              {loading ? 'Saving...' : editingWorker ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Workers;