import React, { useEffect, useState } from 'react';
import { Building, Users, Bed, UserCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { pgAPI, guestAPI, roomAPI, wardenAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPGs: 0,
    totalGuests: 0,
    totalRooms: 0,
    pendingPayments: 0,
    totalWardens: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // This is a simplified version - in a real app, you'd have dedicated dashboard endpoints
        const [wardens] = await Promise.all([
          wardenAPI.getAll(),
        ]);
        
        setStats({
          totalPGs: 0, // Would need to aggregate from owner data
          totalGuests: 0,
          totalRooms: 0,
          pendingPayments: 0,
          totalWardens: wardens.data.length,
          occupancyRate: 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Total PGs',
      value: stats.totalPGs,
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      name: 'Total Guests',
      value: stats.totalGuests,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      name: 'Total Rooms',
      value: stats.totalRooms,
      icon: Bed,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      name: 'Pending Payments',
      value: stats.pendingPayments,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
    {
      name: 'Total Wardens',
      value: stats.totalWardens,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900',
    },
    {
      name: 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Overview of your PG management system
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              New guest checked in to Room 101
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              Payment received from John Doe
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              Room 205 cleaning scheduled
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              Add New Guest
            </button>
            <button className="w-full btn-secondary text-left">
              Create New Room
            </button>
            <button className="w-full btn-secondary text-left">
              Generate Revenue Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;