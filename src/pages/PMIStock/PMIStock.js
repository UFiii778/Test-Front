/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/PMIStock/PMIStock.jsx
// DESKRIPSI: PMI stock management page
// =====================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BeakerIcon,
  PlusIcon,
  MinusIcon,
  ArrowPathIcon,
  ClockIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Input, Modal } from '../../components/atoms';
import { AlertMessage } from '../../components/molecules';
import api from '../../services/api';

const PMIStock = () => {
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [transferData, setTransferData] = useState({
    from_id: '',
    to_id: '',
    quantity: '',
    notes: ''
  });
  const [locations, setLocations] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStocks();
    fetchLocations();
  }, []);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blood-stock');
      setStocks(response.data.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await api.get('/blood-stock');
      const locations = response.data.data.map(loc => ({
        id: loc.location_id,
        name: loc.location_name,
        type: loc.location_type
      }));
      setLocations(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleUpdateStock = async () => {
    if (!updateQuantity || updateQuantity < 0) {
      setError('Jumlah stok harus diisi dan tidak negatif');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      await api.put(`/blood-stock/${selectedStock.id}`, {
        quantity: parseInt(updateQuantity),
        notes: updateNotes
      });
      setSuccess('Stok berhasil diperbarui');
      setShowUpdateModal(false);
      fetchStocks();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui stok');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransferStock = async () => {
    if (!transferData.from_id || !transferData.to_id || !transferData.quantity) {
      setError('Semua field harus diisi');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      await api.post('/blood-stock/transfer', transferData);
      setSuccess('Transfer stok berhasil');
      setShowTransferModal(false);
      fetchStocks();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal transfer stok');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (quantity) => {
    if (quantity < 10) return 'text-red-600 bg-red-50';
    if (quantity < 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = (quantity) => {
    if (quantity < 10) return 'Kritis';
    if (quantity < 20) return 'Waspada';
    return 'Aman';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h4" className="mb-2">
            Manajemen Stok Darah
          </Typography>
          <Typography variant="body2" color="secondary">
            Kelola stok darah di seluruh lokasi
          </Typography>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchStocks}>
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Refresh
          </Button>
          <Button variant="primary" onClick={() => setShowTransferModal(true)}>
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Transfer Stok
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <AlertMessage
          type="error"
          message={error}
          dismissible
          onClose={() => setError('')}
        />
      )}
      
      {success && (
        <AlertMessage
          type="success"
          message={success}
          dismissible
          onClose={() => setSuccess('')}
        />
      )}

      {/* Stock List */}
      <div className="space-y-6">
        {stocks.map((location) => (
          <motion.div
            key={location.location_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Typography variant="h6" className="mb-1">
                    {location.location_name}
                  </Typography>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {location.location_type === 'hospital' ? 'Rumah Sakit' : 'PMI'}
                    </Badge>
                    <Typography variant="caption" color="secondary">
                      {location.city}, {location.province}
                    </Typography>
                  </div>
                </div>
                <Typography variant="caption" color="secondary" className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  Update: {new Date(location.last_updated).toLocaleString()}
                </Typography>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {location.stocks.map((stock) => (
                  <div
                    key={stock.id}
                    className={`
                      p-4 rounded-lg text-center cursor-pointer hover:shadow-md transition-shadow
                      ${getStatusColor(stock.quantity)}
                    `}
                    onClick={() => {
                      setSelectedStock(stock);
                      setUpdateQuantity(stock.quantity);
                      setShowUpdateModal(true);
                    }}
                  >
                    <Typography variant="h5" weight="bold" className="mb-1">
                      {stock.blood_type}
                    </Typography>
                    <Typography variant="h4" className="mb-2">
                      {stock.quantity}
                    </Typography>
                    <Badge variant={
                      stock.quantity < 10 ? 'danger' :
                      stock.quantity < 20 ? 'warning' : 'success'
                    }>
                      {getStatusText(stock.quantity)}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Update Stock Modal */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Update Stok Darah"
      >
        <div className="space-y-4">
          {selectedStock && (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Typography variant="body2" weight="medium">
                    {selectedStock.blood_type}
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    Stok saat ini: {selectedStock.quantity} kantong
                  </Typography>
                </div>
                <Badge variant={
                  selectedStock.quantity < 10 ? 'danger' :
                  selectedStock.quantity < 20 ? 'warning' : 'success'
                }>
                  {getStatusText(selectedStock.quantity)}
                </Badge>
              </div>

              <Input
                label="Jumlah Stok Baru"
                type="number"
                min="0"
                value={updateQuantity}
                onChange={(e) => setUpdateQuantity(e.target.value)}
              />

              <Input
                label="Catatan (opsional)"
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
                placeholder="Contoh: penambahan dari donor, pengurangan untuk RS"
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowUpdateModal(false)}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleUpdateStock}
                  loading={submitting}
                >
                  Update Stok
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Transfer Stock Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Transfer Stok Darah"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Typography variant="body2" weight="bold" className="mb-2">
                Dari Lokasi
              </Typography>
              <select
                value={transferData.from_id}
                onChange={(e) => setTransferData({ ...transferData, from_id: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Pilih lokasi sumber</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.type === 'hospital' ? 'RS' : 'PMI'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Typography variant="body2" weight="bold" className="mb-2">
                Ke Lokasi
              </Typography>
              <select
                value={transferData.to_id}
                onChange={(e) => setTransferData({ ...transferData, to_id: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Pilih lokasi tujuan</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.type === 'hospital' ? 'RS' : 'PMI'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Golongan Darah"
              type="select"
              value={transferData.blood_type}
              onChange={(e) => setTransferData({ ...transferData, blood_type: e.target.value })}
            >
              <option value="">Pilih golongan darah</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </Input>

            <Input
              label="Jumlah Transfer"
              type="number"
              min="1"
              value={transferData.quantity}
              onChange={(e) => setTransferData({ ...transferData, quantity: e.target.value })}
            />
          </div>

          <Input
            label="Catatan (opsional)"
            value={transferData.notes}
            onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
            placeholder="Contoh: transfer darurat, stock opname"
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <Typography variant="caption" color="primary">
              ℹ️ Transfer stok akan mengurangi stok dari lokasi sumber dan menambah di lokasi tujuan.
              Pastikan data yang dimasukkan sudah benar.
            </Typography>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowTransferModal(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleTransferStock}
              loading={submitting}
            >
              Transfer Stok
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PMIStock;