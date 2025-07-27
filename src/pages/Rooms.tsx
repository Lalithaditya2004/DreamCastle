import React, { useState } from 'react';
import { Plus, Search, Calendar, Filter } from 'lucide-react';
import { Room } from '../types';
import { roomAPI } from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [cleaningStatus, setCleaningStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    pgId: '',
    floorNo: '',
    roomNo: '',
  });
  const [vacancyFilters, setVacancyFilters] = useState({
    pgId: '',
    floor: '',
    date: '',
    beds: '',
    status: '',
  });
  const [formData, setFormData] = useState({
    RoomNo: '',
    FloorNo: '',
    Beds: '',
    last_cleaned: '',
    Status: 'Empty' as 'Full' | 'Empty' | 'Partial',
    PGId: '',
  });

  const resetForm = () => {
    setFormData({
      RoomNo: '',
      FloorNo: '',
      Beds: '',
      last_cleaned: '',
      Status: 'Empty',
      PGId: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        ...formData,
        FloorNo: parseInt(formData.FloorNo),
        Beds: parseInt(formData.Beds),
        PGId: parseInt(formData.PGId),
      };

      await roomAPI.create(data);
      setIsModalOpen(false);
      resetForm();
      alert('Room created successfully!');
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error creating room');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomsByPG = async () => {
    if (!searchParams.pgId) return;
    
    setLoading(true);
    try {
      const response = await roomAPI.getByPG(parseInt(searchParams.pgId));
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      alert('Error fetching rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomsByFloor = async () => {
    if (!searchParams.pgId || !searchParams.floorNo) return;
    
    setLoading(true);
    try {
      const response = await roomAPI.getByFloor(parseInt(searchParams.pgId), parseInt(searchParams.floorNo));
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      alert('Error fetching rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomByNumber = async () => {
    if (!searchParams.pgId || !searchParams.roomNo) return;
    
    setLoading(true);
    try {
      const response = await roomAPI.getByRoomNo(parseInt(searchParams.pgId), searchParams.roomNo);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
      alert('Error fetching room');
    } finally {
      setLoading(false);
    }
  };

  const fetchVacantRooms = async () => {
    if (!vacancyFilters.pgId) return;
    
    setLoading(true);
    try {
      const params: any = {};
      if (vacancyFilters.floor) params.floor = parseInt(vacancyFilters.floor);
      if (vacancyFilters.date) params.date = vacancyFilters.date;
      if (vacancyFilters.beds) params.beds = parseInt(vacancyFilters.beds);
      if (vacancyFilters.status) params.status = vacancyFilters.status;

      const response = await roomAPI.getVacancies(parseInt(vacancyFilters.pgId), params);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching vacant rooms:', error);
      alert('Error fetching vacant rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchCleaningStatus = async () => {
    if (!searchParams.pgId || !searchParams.floorNo) return;
    
    setLoading(true);
    try {
      const response = await roomAPI.getCleaningStatus(parseInt(searchParams.pgId), parseInt(searchParams.floorNo));
      setCleaningStatus(response.data);
    } catch (error) {
      console.error('Error fetching cleaning status:', error);
      alert('Error fetching cleaning status');
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rooms</h1>
        <button onClick={handleOpenModal} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </button>
      </div>

      {/* Search Sections */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Basic Search */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Search Rooms
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="PG ID"
                value={searchParams.pgId}
                onChange={(e) => setSearchParams({ ...searchParams, pgId: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Floor Number"
                value={searchParams.floorNo}
                onChange={(e) => setSearchParams({ ...searchParams, floorNo: e.target.value })}
                className="input-field"
              />
            </div>
            <input
              type="text"
              placeholder="Room Number"
              value={searchParams.roomNo}
              onChange={(e) => setSearchParams({ ...searchParams, roomNo: e.target.value })}
              className="input-field"
            />
            <div className="flex gap-2">
              <button onClick={fetchRoomsByPG} className="btn-primary flex-1">
                <Search className="h-4 w-4 mr-2" />
                By PG
              </button>
              <button onClick={fetchRoomsByFloor} className="btn-secondary flex-1">
                By Floor
              </button>
              <button onClick={fetchRoomByNumber} className="btn-secondary flex-1">
                By Room No
              </button>
            </div>
          </div>
        </div>

        {/* Vacancy Search */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Find Vacant Rooms
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="PG ID"
                value={vacancyFilters.pgId}
                onChange={(e) => setVacancyFilters({ ...vacancyFilters, pgId: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Floor (Optional)"
                value={vacancyFilters.floor}
                onChange={(e) => setVacancyFilters({ ...vacancyFilters, floor: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                placeholder="Date"
                value={vacancyFilters.date}
                onChange={(e) => setVacancyFilters({ ...vacancyFilters, date: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Beds (Optional)"
                value={vacancyFilters.beds}
                onChange={(e) => setVacancyFilters({ ...vacancyFilters, beds: e.target.value })}
                className="input-field"
              />
            </div>
            <select
              value={vacancyFilters.status}
              onChange={(e) => setVacancyFilters({ ...vacancyFilters, status: e.target.value })}
              className="input-field"
            >
              <option value="">All Statuses</option>
              <option value="Empty">Empty</option>
              <option value="Partial">Partial</option>
              <option value="Full">Full</option>
            </select>
            <button onClick={fetchVacantRooms} className="btn-primary w-full">
              <Filter className="h-4 w-4 mr-2" />
              Find Vacant Rooms
            </button>
          </div>
        </div>
      </div>

      {/* Cleaning Status Section */}
      <div className="card mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Cleaning Status
        </h3>
        <div className="flex gap-4 mb-4">
          <input
            type="number"
            placeholder="PG ID"
            value={searchParams.pgId}
            onChange={(e) => setSearchParams({ ...searchParams, pgId: e.target.value })}
            className="input-field flex-1"
          />
          <input
            type="number"
            placeholder="Floor Number"
            value={searchParams.floorNo}
            onChange={(e) => setSearchParams({ ...searchParams, floorNo: e.target.value })}
            className="input-field flex-1"
          />
          <button onClick={fetchCleaningStatus} className="btn-primary">
            <Calendar className="h-4 w-4 mr-2" />
            Get Cleaning Status
          </button>
        </div>
        
        {cleaningStatus.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cleaningStatus.map((room, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Room {room.RoomNo}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last cleaned: {new Date(room.last_cleaned).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rooms List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div key={room.RoomId} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Room {room.RoomNo}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  room.Status === 'Empty' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  room.Status === 'Partial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {room.Status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><span className="font-medium">Floor:</span> {room.FloorNo}</p>
                <p><span className="font-medium">Beds:</span> {room.Beds}</p>
                <p><span className="font-medium">Vacancies:</span> {room.Vacancies}</p>
                <p><span className="font-medium">Last Cleaned:</span> {new Date(room.last_cleaned).toLocaleDateString()}</p>
                <p><span className="font-medium">PG ID:</span> {room.PGId}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {rooms.length === 0 && !loading && (searchParams.pgId || vacancyFilters.pgId) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No rooms found with the specified criteria
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Room"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room Number
              </label>
              <input
                type="text"
                required
                value={formData.RoomNo}
                onChange={(e) => setFormData({ ...formData, RoomNo: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Floor Number
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.FloorNo}
                onChange={(e) => setFormData({ ...formData, FloorNo: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Beds
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.Beds}
                onChange={(e) => setFormData({ ...formData, Beds: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.Status}
                onChange={(e) => setFormData({ ...formData, Status: e.target.value as 'Full' | 'Empty' | 'Partial' })}
                className="input-field"
              >
                <option value="Empty">Empty</option>
                <option value="Partial">Partial</option>
                <option value="Full">Full</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Cleaned
              </label>
              <input
                type="date"
                required
                value={formData.last_cleaned}
                onChange={(e) => setFormData({ ...formData, last_cleaned: e.target.value })}
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

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Rooms;