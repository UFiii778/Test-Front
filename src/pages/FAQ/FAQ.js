/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/FAQ/FAQ.jsx
// DESKRIPSI: FAQ page
// =====================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BeakerIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Input, Button } from '../../components/atoms';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState({});

  const categories = [
    {
      id: 'general',
      label: 'Umum',
      icon: DocumentTextIcon,
      questions: [
        {
          question: 'Apa itu DarahKita?',
          answer: 'DarahKita adalah platform digital yang mempertemukan pendonor darah dengan mereka yang membutuhkan. Kami memudahkan pencarian donor, pengecekan stok darah, dan manajemen donor darah di Indonesia.'
        },
        {
          question: 'Apakah DarahKita gratis?',
          answer: 'Ya, DarahKita gratis untuk semua pengguna. Kami tidak memungut biaya apapun untuk menggunakan layanan ini.'
        },
        {
          question: 'Bagaimana cara mendaftar?',
          answer: 'Anda dapat mendaftar melalui aplikasi atau website DarahKita dengan mengklik tombol "Daftar" dan mengisi formulir registrasi.'
        }
      ]
    },
    {
      id: 'donor',
      label: 'Pendonor',
      icon: HeartIcon,
      questions: [
        {
          question: 'Apa saja syarat donor darah?',
          answer: 'Syarat donor darah: usia 17-60 tahun, berat badan minimal 45 kg, tekanan darah normal (sistole 100-160, diastole 70-100), kadar hemoglobin 12,5-17 gr%, tidak dalam masa haid/hamil/menyusui, tidak demam atau batuk, dan tidak minum obat tertentu.'
        },
        {
          question: 'Berapa lama interval donor darah?',
          answer: 'Interval donor darah untuk pria adalah setiap 3 bulan (maksimal 5 kali setahun), sedangkan untuk wanita setiap 4 bulan (maksimal 4 kali setahun).'
        },
        {
          question: 'Apa yang harus dilakukan setelah donor darah?',
          answer: 'Setelah donor darah, istirahat 15-30 menit, makan makanan ringan, perbanyak minum air putih, hindari alkohol dan rokok, serta jangan olahraga berat selama 24 jam.'
        },
        {
          question: 'Apakah ada manfaat donor darah?',
          answer: 'Manfaat donor darah antara lain: membantu menyelamatkan nyawa, menjaga kesehatan jantung, menurunkan risiko kanker, membakar kalori, dan deteksi dini penyakit.'
        }
      ]
    },
    {
      id: 'patient',
      label: 'Pasien',
      icon: UserGroupIcon,
      questions: [
        {
          question: 'Bagaimana cara meminta donor darah?',
          answer: 'Anda dapat membuat permintaan donor melalui menu "Buat Permintaan". Isi golongan darah, jumlah kantong, tingkat urgensi, dan lokasi Anda.'
        },
        {
          question: 'Berapa lama biasanya mendapat donor?',
          answer: 'Waktu mendapatkan donor bervariasi tergantung ketersediaan pendonor dengan golongan darah yang cocok. Semakin tinggi urgensi, semakin cepat sistem mencari pendonor.'
        },
        {
          question: 'Apakah saya perlu membayar?',
          answer: 'Tidak, darah donor diberikan secara gratis. Namun, biaya pengolahan dan penyimpanan darah mungkin dikenakan oleh rumah sakit.'
        }
      ]
    },
    {
      id: 'hospital',
      label: 'Rumah Sakit',
      icon: BuildingOfficeIcon,
      questions: [
        {
          question: 'Bagaimana cara mendaftarkan rumah sakit?',
          answer: 'Rumah sakit dapat mendaftar melalui menu "Daftar Rumah Sakit" atau menghubungi tim DarahKita untuk kerjasama.'
        },
        {
          question: 'Bagaimana cara update stok darah?',
          answer: 'Rumah sakit yang sudah terdaftar dapat mengupdate stok darah melalui dashboard PMI/rumah sakit.'
        }
      ]
    },
    {
      id: 'technical',
      label: 'Teknis',
      icon: BeakerIcon,
      questions: [
        {
          question: 'Aplikasi error, bagaimana?',
          answer: 'Jika mengalami kendala teknis, silakan hubungi customer service kami di info@darahkita.id atau telepon 021-1234567.'
        },
        {
          question: 'Apakah data saya aman?',
          answer: 'Ya, kami menjaga keamanan data Anda dengan enkripsi dan tidak akan membagikan data pribadi Anda tanpa izin.'
        },
        {
          question: 'Bagaimana cara reset password?',
          answer: 'Anda dapat mereset password dengan mengklik "Lupa Password" di halaman login dan mengikuti instruksi yang dikirim ke email Anda.'
        }
      ]
    }
  ];

  const toggleItem = (categoryId, index) => {
    setOpenItems(prev => ({
      ...prev,
      [`${categoryId}-${index}`]: !prev[`${categoryId}-${index}`]
    }));
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <section className="text-center">
        <Typography variant="h2" className="mb-4">
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color="secondary" className="mb-8">
          Temukan jawaban untuk pertanyaan yang sering diajukan
        </Typography>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Cari pertanyaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={MagnifyingGlassIcon}
          />
        </div>
      </section>

      {/* Categories */}
      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-primary-600" />
                </div>
                <Typography variant="h5">
                  {category.label}
                </Typography>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <button
                      onClick={() => toggleItem(category.id, index)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <Typography variant="body1" weight="medium">
                        {faq.question}
                      </Typography>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          openItems[`${category.id}-${index}`] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {openItems[`${category.id}-${index}`] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-gray-600"
                      >
                        <Typography variant="body2">
                          {faq.answer}
                        </Typography>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Contact CTA */}
      <Card className="text-center bg-primary-50 border-primary-200">
        <Typography variant="h5" className="mb-2">
          Tidak menemukan jawaban?
        </Typography>
        <Typography variant="body2" color="secondary" className="mb-4">
          Hubungi customer service kami untuk bantuan lebih lanjut
        </Typography>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <Button variant="primary">
              Hubungi Kami
            </Button>
          </Link>
          <a href="mailto:info@darahkita.id">
            <Button variant="outline">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              info@darahkita.id
            </Button>
          </a>
        </div>
      </Card>
    </div>
  );
};

export default FAQ;