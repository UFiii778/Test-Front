/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/NewsDetail/NewsDetail.jsx
// DESKRIPSI: News detail page
// =====================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  UserIcon,
  ArrowLeftIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Divider, Badge } from '../../components/atoms';
import { Breadcrumb, SocialShare } from '../../components/molecules';
import api from '../../services/api';
import { formatDate, formatDistanceToNow } from '../../utils/dateFormatter';

const NewsDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/news/${slug}`);
      setArticle(response.data.data);
      setRelatedNews(response.data.data.related_news || []);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <Typography variant="h5" color="danger">
          Artikel tidak ditemukan
        </Typography>
        <Link to="/news" className="mt-4 inline-block">
          <Button variant="primary">Kembali ke Berita</Button>
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Berita', path: '/news' },
    { label: article.category, path: `/news?category=${article.category}` },
    { label: article.title }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Back Button */}
      <Link to="/news" className="inline-flex items-center text-gray-600 hover:text-primary-600">
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        Kembali ke Berita
      </Link>

      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden">
          {/* Featured Image */}
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center">
              <Typography variant="h2" color="white" className="text-center px-4">
                {article.title}
              </Typography>
            </div>
          )}

          {/* Article Info */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="primary" size="lg">
                {getCategoryLabel(article.category)}
              </Badge>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {formatDate(article.published_at)}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {formatDistanceToNow(article.published_at)}
                </span>
                <span className="flex items-center">
                  <EyeIcon className="w-4 h-4 mr-1" />
                  {article.views} dibaca
                </span>
              </div>
            </div>

            <Typography variant="h3" className="mb-4">
              {article.title}
            </Typography>

            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <UserIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <Typography variant="body2" weight="medium">
                  {article.author_name}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Penulis
                </Typography>
              </div>
            </div>

            <Divider />

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mt-6">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Share Buttons */}
            <Divider className="my-8" />

            <div className="flex items-center justify-between">
              <Typography variant="body2" weight="medium">
                Bagikan artikel ini:
              </Typography>
              <SocialShare
                url={window.location.href}
                title={article.title}
                description={article.summary || article.content.substring(0, 200)}
                platforms={['facebook', 'twitter', 'whatsapp', 'telegram']}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h5" className="mb-4">
            Berita Terkait
          </Typography>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedNews.map((item) => (
              <Link key={item.id} to={`/news/${item.slug}`}>
                <Card hoverable className="h-full">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-t-2xl"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-t-2xl flex items-center justify-center">
                      <NewspaperIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <Typography variant="body2" weight="bold" className="mb-2 line-clamp-2">
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="secondary" className="line-clamp-2">
                      {item.summary || item.content.substring(0, 100)}
                    </Typography>
                    <div className="mt-2 text-xs text-gray-400">
                      {formatDistanceToNow(item.published_at)}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NewsDetail;