import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, DollarSign, Calendar, UserPlus } from 'lucide-react';
import { Guest } from '../types';
import { guestAPI } from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const Guests: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignRoomModalOpen, setIsAssignRoomModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [searchParams, setSearchParams] = useState({
    pgId: '',
    roomNumber: '',
    floorNumber: '',
  });
  const [roomAssignment, setRoomAssignment] = useState('');
  const [formData, setFormData] = useState({
    AadharID: '',
    G_name: '',
    RoomId: '',
    Fee: '',
    Fee_status: 'Pending' as 'Paid' | 'Pending',
    DOJ: '',
    DOL: '',
    Phno: '',
    DOP: '',
    PGId: '',
  });

  const resetForm = () => {
    setFormData({
      AadharID: '',
      G_name: '',
      RoomId: '',
      Fee: '',
      Fee_status: 'Pending',
      DOJ: '',
      DOL: '',
      Phno: '',
      DOP: '',
      PGId: '',
    });
    setEditingGuest(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        ...formData,
        AadharID: parseInt(formData.AadharID),
        RoomId: formData.RoomId ? parseInt(formData.RoomId) : undefined,
        Fee: parseInt(formData.Fee),
        Phno: parseInt(formData.Phno),
        PGId: parseInt(formData.PGId),
        DOL: formData.DOL || undefined,
        DOP: formData.DOP || undefined,
      };

      if (editingGuest) {
        await guestAPI.updateDetails(editingGuest.AadharID, data);
      } else {
        await guestAPI.create(data);
      }
      
      setIsModalOpen(false);
      resetForm();
      // Refresh the list if we have search params
      if (searchParams.pgId) {
        await fetchGuestsByPG();
      }
    } catch (error) {
      console.error('Error saving guest:', error);
      alert('Error saving guest');
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestsByPG = async () => {
    if (!searchParams.pgId) return;
    
    setLoading(true);
    try {
      const response = await guestAPI.getByPG(parseInt(searchParams.pgId));
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
      alert('Error fetching guests');
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestsByRoom = async () => {
    if (!searchParams.pgId || !searchParams.roomNumber) return;
    
    setLoading(true);
    try {
      const response = await guestAPI.getByRoom(parseInt(searchParams.pgId), searchParams.roomNumber);
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
      alert('Error fetching guests');
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestsByFloor = async () => {
    if (!searchParams.pgId || !searchParams.floorNumber) return;
    
    setLoading(true);
    try {
      const response = await guestAPI.getByFloor(parseInt(searchParams.pgId), parseInt(searchParams.floorNumber));
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
      alert('Error fetching guests');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingGuests = async () => {
    if (!searchParams.pgId) return;
    
    setLoading(true);
    try {
      const response = await guestAPI.getPending(parseInt(searchParams.pgId));
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching pending guests:', error);
      alert('Error fetching pending guests');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (aadharId: number) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;
    
    setLoading(true);
    try {
      await guestAPI.delete(aadharId);
      setGuests(guests.filter(guest => guest.AadharID !== aadharId));
    } catch (error) {
      console.error('Error deleting guest:', error);
      alert('Error deleting guest');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFeeStatus = async (aadharId: number, status: string) => {
    setLoading(true);
    try {
      await guestAPI.updateFeeStatus(aadharId, status);
      // Refresh the current list
      if (searchParams.pgId) {
        await fetchGuestsByPG();
      }
    } catch (error) {
      console.error('Error updating fee status:', error);
      alert('Error updating fee status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDOL = async (aadharId: number, dol: string) => {
    setLoading(true);
    try {
      await guestAPI.updateDOL(aadharId, dol);
      // Refresh the current list
      if (searchParams.pgId) {
        await fetchGuestsByPG();
      }
    } catch (error) {
      console.error('Error updating date of leaving:', error);
      alert('Error updating date of leaving');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;
    
    setLoading(true);
    try {
      await guestAPI.assignRoom(selectedGuest.AadharID, parseInt(roomAssignment));
      setIsAssignRoomModalOpen(false);
      setRoomAssignment('');
      // Refresh the current list
      if (searchParams.pgId) {
        await fetchGuestsByPG();
      }
    } catch (error) {
      console.error('Error assigning room:', error);
      alert('Error assigning room');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      AadharID: guest.AadharID.toString(),
      G_name: guest.G_name,
      RoomId: guest.RoomId?.toString() || '',
      Fee: guest.Fee.toString(),
      Fee_status: guest.Fee_status,
      DOJ: guest.DOJ,
      DOL: guest.DOL || '',
      Phno: guest.Phno.toString(),
      DOP: guest.DOP || '',
      PGId: guest.PGId.toString(),
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guests</h1>
        <button onClick={handleOpenModal} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Guest
        </button>
      </div>

      {/* Search Section */}
      <div className="card mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Search Guests
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="number"
            placeholder="PG ID"
            value={searchParams.pgId}
            onChange={(e) => setSearchParams({ ...searchParams, pgId: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Room Number"
            value={searchParams.roomNumber}
            onChange={(e) => setSearchParams({ ...searchParams, roomNumber: e.target.value })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Floor Number"
            value={searchParams.floorNumber}
            onChange={(e) => setSearchParams({ ...searchParams, floorNumber: e.target.value })}
            className="input-field"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={fetchGuestsByPG} className="btn-primary">
            <Search className="h-4 w-4 mr-2" />
            By PG
          </button>
          <button onClick={fetchGuestsByRoom} className="btn-secondary">
            By Room
          </button>
          <button onClick={fetchGuestsByFloor} className="btn-secondary">
            By Floor
          </button>
          <button onClick={fetchPendingGuests} className="btn-secondary">
            <DollarSign className="h-4 w-4 mr-2" />
            Pending Payments
          </button>
        </div>
      </div>

      {/* Guests List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guests.map((guest) => (
            <div key={guest.AadharID} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {guest.G_name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(guest)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(guest.AadharID)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p><span className="font-medium">Aadhar ID:</span> {guest.AadharID}</p>
                <p><span className="font-medium">Phone:</span> {guest.Phno}</p>
                <p><span className="font-medium">Fee:</span> ₹{guest.Fee}</p>
                <p>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    guest.Fee_status === 'Paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {guest.Fee_status}
                  </span>
                </p>
                <p><span className="font-medium">DOJ:</span> {new Date(guest.DOJ).toLocaleDateString()}</p>
                {guest.DOL && <p><span className="font-medium">DOL:</span> {new Date(guest.DOL).toLocaleDateString()}</p>}
                {guest.RoomId && <p><span className="font-medium">Room ID:</span> {guest.RoomId}</p>}
                {guest.DOP && <p><span className="font-medium">DOP:</span> {new Date(guest.DOP).toLocaleDateString()}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateFeeStatus(guest.AadharID, guest.Fee_status === 'Paid' ? 'Pending' : 'Paid')}
                  className="btn-secondary text-xs"
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  Toggle Fee
                </button>
                <button
                  onClick={() => {
                    const dol = prompt('Enter Date of Leaving (YYYY-MM-DD):');
                    if (dol) handleUpdateDOL(guest.AadharID, dol);
                  }}
                  className="btn-secondary text-xs"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Update DOL
                </button>
                <button
                  onClick={() => {
                    setSelectedGuest(guest);
                    setIsAssignRoomModalOpen(true);
                  }}
                  className="btn-secondary text-xs"
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Assign Room
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {guests.length === 0 && !loading && searchParams.pgId && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No guests found with the specified criteria
        </div>
      )}

      {/* Main Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGuest ? 'Edit Guest' : 'Add New Guest'}
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
                value={formData.AadharID}
                onChange={(e) => setFormData({ ...formData, AadharID: e.target.value })}
                className="input-field"
                disabled={!!editingGuest}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.G_name}
                onChange={(e) => setFormData({ ...formData, G_name: e.target.value })}
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fee Amount
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.Fee}
                onChange={(e) => setFormData({ ...formData, Fee: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fee Status
              </label>
              <select
                value={formData.Fee_status}
                onChange={(e) => setFormData({ ...formData, Fee_status: e.target.value as 'Paid' | 'Pending' })}
                className="input-field"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Joining
              </label>
              <input
                type="date"
                required
                value={formData.DOJ}
                onChange={(e) => setFormData({ ...formData, DOJ: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Leaving (Optional)
              </label>
              <input
                type="date"
                value={formData.DOL}
                onChange={(e) => setFormData({ ...formData, DOL: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room ID (Optional)
              </label>
              <input
                type="number"
                value={formData.RoomId}
                onChange={(e) => setFormData({ ...formData, RoomId: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Payment (Optional)
              </label>
              <input
                type="date"
                value={formData.DOP}
                onChange={(e) => setFormData({ ...formData, DOP: e.target.value })}
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
              {loading ? 'Saving...' : editingGuest ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Room Modal */}
      <Modal
        isOpen={isAssignRoomModalOpen}
        onClose={() => setIsAssignRoomModalOpen(false)}
        title="Assign Room to Guest"
      >
        <form onSubmit={handleAssignRoom} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Room ID
            </label>
            <input
              type="number"
              required
              value={roomAssignment}
              onChange={(e) => setRoomAssignment(e.target.value)}
              className="input-field"
              placeholder="Enter Room ID"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAssignRoomModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Assigning...' : 'Assign Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Guests;