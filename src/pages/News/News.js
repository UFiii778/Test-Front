/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/News/News.jsx
// DESKRIPSI: News list page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  NewspaperIcon,
  ClockIcon,
  EyeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge, Input } from '../../components/atoms';
import { Pagination } from '../../components/molecules';
import api from '../../services/api';
import { formatDate, formatDistanceToNow } from '../../utils/dateFormatter';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  });
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    fetchNews();
    fetchCategories();
    fetchFeatured();
  }, [pagination.page, selectedCategory, searchTerm]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        category: selectedCategory || undefined,
        search: searchTerm || undefined
      };

      const response = await api.get('/news', { params });
      setNews(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      });
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/news/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFeatured = async () => {
    try {
      const response = await api.get('/news/featured');
      setFeatured(response.data.data[0]);
    } catch (error) {
      console.error('Error fetching featured:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      berita: 'Berita',
      artikel: 'Artikel',
      pengumuman: 'Pengumuman',
      kegiatan: 'Kegiatan'
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Typography variant="h3" className="mb-4">
          Berita & Artikel
        </Typography>
        <Typography variant="body1" color="secondary" className="max-w-2xl mx-auto">
          Dapatkan informasi terbaru seputar donor darah, kegiatan PMI, 
          dan artikel kesehatan
        </Typography>
      </div>

      {/* Featured News */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to={`/news/${featured.slug}`}>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64 md:h-auto">
                  {featured.image_url ? (
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                      <NewspaperIcon className="w-20 h-20 text-white opacity-50" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <Badge variant="primary" size="sm" className="mb-3">
                    {getCategoryLabel(featured.category)}
                  </Badge>
                  <Typography variant="h4" className="mb-3">
                    {featured.title}
                  </Typography>
                  <Typography variant="body2" color="secondary" className="mb-4 line-clamp-3">
                    {featured.summary || featured.content.substring(0, 200)}
                  </Typography>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span>{formatDate(featured.published_at)}</span>
                    <EyeIcon className="w-4 h-4 ml-4 mr-1" />
                    <span>{featured.views} dibaca</span>
                  </div>
                  <Button variant="primary" className="w-fit">
                    Baca Selengkapnya
                    <ChevronRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      )}

      {/* Search and Categories */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Search */}
        <div className="md:col-span-3">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Cari berita atau artikel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Cari</Button>
          </form>
        </div>

        {/* Categories */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryClick(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {getCategoryLabel(cat.category)} ({cat.total})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {news.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {news.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/news/${item.slug}`}>
                    <Card hoverable className="h-full overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <NewspaperIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="p-4">
                        <Badge variant="secondary" size="sm" className="mb-2">
                          {getCategoryLabel(item.category)}
                        </Badge>
                        <Typography variant="h6" className="mb-2 line-clamp-2">
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="secondary" className="mb-3 line-clamp-3">
                          {item.summary || item.content.substring(0, 150)}
                        </Typography>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {formatDistanceToNow(item.published_at)}
                          </span>
                          <span className="flex items-center">
                            <EyeIcon className="w-3 h-3 mr-1" />
                            {item.views}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="text-center py-12">
              <NewspaperIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" className="mb-2">
                Tidak ada berita ditemukan
              </Typography>
              <Typography variant="body2" color="secondary">
                Coba ubah kata kunci pencarian atau filter kategori
              </Typography>
            </Card>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default News;