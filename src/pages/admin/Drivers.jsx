import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { driversAPI, busCompaniesAPI } from '../../services/api';
import {
  User,
  Plus,
  Edit,
  Trash2,
  Search,
  Phone,
  BadgeCheck,
  Mail,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [busCompanies, setBusCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [registerWithCredentials, setRegisterWithCredentials] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    licenseNumber: '',
    busCompanyId: ''
  });

  useEffect(() => {
    loadDrivers();
    loadBusCompanies();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const res = await driversAPI.getAll();
      setDrivers(res.data || []);
    } catch {
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const loadBusCompanies = async () => {
    try {
      const res = await busCompaniesAPI.getAll();
      setBusCompanies(res.data || []);
    } catch {
      console.error('Failed to load bus companies');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDriver) {
        await driversAPI.update(editingDriver.id, formData);
        toast.success('Driver updated');
      } else if (registerWithCredentials && formData.busCompanyId) {
        await driversAPI.registerWithCredentials(formData, formData.busCompanyId);
        toast.success('Driver registered with credentials. Email sent with login details.');
      } else {
        await driversAPI.create(formData);
        toast.success('Driver created');
      }

      setShowModal(false);
      setEditingDriver(null);
      setRegisterWithCredentials(false);

      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        licenseNumber: '',
        busCompanyId: ''
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
      licenseNumber: driver.licenseNumber || '',
      busCompanyId: driver.busCompany?.id || ''
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
              setRegisterWithCredentials(false);
              setFormData({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                licenseNumber: '',
                busCompanyId: ''
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

                  {driver.busCompany && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {driver.busCompany.name}
                    </div>
                  )}

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

                {!editingDriver && (
                  <>
                    <select
                      value={formData.busCompanyId}
                      onChange={(e) =>
                        setFormData({ ...formData, busCompanyId: e.target.value })
                      }
                      className={inputCls}
                    >
                      <option value="">Select Bus Company (Optional)</option>
                      {busCompanies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="registerWithCredentials"
                        checked={registerWithCredentials}
                        onChange={(e) => setRegisterWithCredentials(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="registerWithCredentials" className="text-sm text-gray-700">
                        Register with email credentials
                      </label>
                    </div>

                    {registerWithCredentials && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <p>
                            This will create a user account for the driver and send login credentials via email.
                            The driver will be able to log in and manage their schedules.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setRegisterWithCredentials(false);
                    }}
                    className="flex-1 py-3 border rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={registerWithCredentials && !formData.busCompanyId}
                    className="flex-1 py-3 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: '#6C63FF' }}
                  >
                    {editingDriver ? 'Update' : registerWithCredentials ? 'Register & Send Email' : 'Create'}
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