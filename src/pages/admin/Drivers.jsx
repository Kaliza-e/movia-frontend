import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { driversAPI, adminAPI, authAPI } from '../../services/api';
import {
  User,
  Plus,
  Edit,
  Trash2,
  Search,
  Phone,
  BadgeCheck
} from 'lucide-react';
import { toast } from 'sonner';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    licenseNumber: ''
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const [driversRes, usersRes] = await Promise.all([
        driversAPI.getAll(),
        adminAPI.getUsers().catch(() => ({ data: [] }))
      ]);

      const adminDrivers = driversRes.data || [];
      const selfDrivers = (usersRes.data || [])
        .filter(u => u.role === 'DRIVER')
        .map(u => ({
          id: u.id,
          firstName: u.firstName || u.name?.split(' ')[0] || u.username,
          lastName: u.lastName || u.name?.split(' ').slice(1).join(' ') || '(Self-Registered)',
          phoneNumber: u.phoneNumber || u.phone || 'N/A',
          licenseNumber: u.licenseNumber || 'Self-Registered User',
          isSelfRegistered: true
        }));

      const allDriversMap = new Map();
      [...adminDrivers, ...selfDrivers].forEach(d => {
        if (!allDriversMap.has(d.id)) {
          allDriversMap.set(d.id, d);
        }
      });
      setDrivers(Array.from(allDriversMap.values()));
    } catch {
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDriver) {
        await driversAPI.update(editingDriver.id, formData);
        toast.success('Driver updated');
      } else {
        let createdUserId = null;
        try {
          // Auto-create user for the driver so they are in both tables
          const baseName = `${formData.firstName.toLowerCase().replace(/\s+/g, '')}.${formData.lastName.toLowerCase().replace(/\s+/g, '')}`;
          const generatedEmail = `${baseName}@driver.movia.com`;
          const generatedUsername = `${baseName}${Math.floor(Math.random() * 1000)}`;

          const userRes = await authAPI.register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: generatedUsername,
            email: generatedEmail,
            phoneNumber: formData.phoneNumber,
            password: 'Driver123!',
            role: 'DRIVER'
          });
          createdUserId = userRes?.data?.user?.id || userRes?.data?.id;
        } catch (e) {
          console.warn('Could not auto-create user for driver', e);
        }

        const payload = {
          ...formData,
          userId: createdUserId,
          user_id: createdUserId
        };
        await driversAPI.create(payload);
        toast.success('Driver created');
      }

      setShowModal(false);
      setEditingDriver(null);

      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        licenseNumber: ''
      });

      loadDrivers();
    } catch {
      toast.error('Failed to save driver');
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);

    setFormData({
      firstName: driver.firstName || '',
      lastName: driver.lastName || '',
      phoneNumber: driver.phoneNumber || '',
      licenseNumber: driver.licenseNumber || ''
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this driver?')) return;

    try {
      await driversAPI.delete(id);
      toast.success('Driver deleted');
      loadDrivers();
    } catch {
      toast.error('Failed to delete driver');
    }
  };

  const filteredDrivers = drivers.filter(d =>
    (d.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (d.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#1A1A2E] text-sm focus:outline-none";

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            {/* <h1 className="text-2xl font-bold">Drivers</h1> */}
            <p className="text-sm text-gray-500">
              Manage all registered drivers
            </p>
          </div>

          <button
            onClick={() => {
              setEditingDriver(null);
              setFormData({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                licenseNumber: ''
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl"
            style={{ background: '#6C63FF' }}
          >
            <Plus className="w-4 h-4" />
            Add Driver
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border"
          />
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-center text-gray-500">Loading drivers...</p>
        ) : filteredDrivers.length === 0 ? (
          <p className="text-center text-gray-500">No drivers found</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                className="bg-white p-5 rounded-xl shadow-sm hover:-translate-y-1 transition"
              >

                {/* HEADER */}
                <div className="flex justify-between mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-indigo-50 rounded-lg">
                    <User className="text-indigo-600 w-5 h-5" />
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(driver)}>
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button onClick={() => handleDelete(driver.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* INFO */}
                <h3 className="font-bold">
                  {driver.firstName} {driver.lastName}
                </h3>

                <div className="mt-3 space-y-2 text-sm text-gray-600">

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {driver.phoneNumber}
                  </div>

                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4" />
                    {driver.licenseNumber}
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-xl">

              <h2 className="text-lg font-bold mb-4">
                {editingDriver ? 'Edit Driver' : 'Add Driver'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">

                <input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className={inputCls}
                  required
                />

                <input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className={inputCls}
                  required
                />

                <input
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className={inputCls}
                  required
                />

                <input
                  placeholder="License Number"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseNumber: e.target.value })
                  }
                  className={inputCls}
                  required
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 text-white rounded-xl"
                    style={{ background: '#6C63FF' }}
                  >
                    {editingDriver ? 'Update' : 'Create'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Drivers;