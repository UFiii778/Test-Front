/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/SocialShare/SocialShare.jsx
// DESKRIPSI: Social media share buttons component
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  ShareIcon,
  LinkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

import { Button, Tooltip } from '../../atoms';

// Social media icons (using SVG paths)
const SocialIcons = {
  facebook: {
    path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
    viewBox: '0 0 24 24'
  },
  twitter: {
    path: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84',
    viewBox: '0 0 24 24'
  },
  whatsapp: {
    path: 'M2.5 21.5l1.517-5.538A9.951 9.951 0 012 12.5C2 6.977 6.477 2.5 12 2.5s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 01-4.642-1.131L2.5 21.5zm5.034-3.992l.303.18A7.96 7.96 0 0012 19.5c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8c0 1.461.392 2.885 1.13 4.126l.198.331-.846 3.087 3.186-.836z',
    viewBox: '0 0 24 24'
  },
  telegram: {
    path: 'M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z',
    viewBox: '0 0 24 24'
  },
  linkedin: {
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z',
    viewBox: '0 0 24 24'
  },
  email: {
    path: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.57 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
    viewBox: '0 0 24 24'
  }
};

const SocialShare = ({
  url = window.location.href,
  title = '',
  description = '',
  image = '',
  platforms = ['facebook', 'twitter', 'whatsapp', 'telegram', 'linkedin', 'email'],
  showCount = false,
  onShare,
  className = '',
  buttonSize = 'md',
  buttonVariant = 'outline',
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  // Share URLs for each platform
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + url)}`
  };

  // Platform display names
  const platformNames = {
    facebook: 'Facebook',
    twitter: 'Twitter',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    linkedin: 'LinkedIn',
    email: 'Email'
  };

  const handleShare = (platform) => {
    const shareUrl = shareUrls[platform];
    
    if (platform === 'copy') {
      copyToClipboard();
    } else {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
      onShare?.(platform);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShare?.('copy');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`} {...props}>
      {/* Share buttons */}
      {platforms.map((platform) => (
        <Tooltip key={platform} content={platformNames[platform]} position="top">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare(platform)}
            className={`
              p-2 rounded-full transition-colors
              ${buttonVariant === 'outline' 
                ? 'border border-gray-300 hover:border-primary-500 hover:text-primary-600' 
                : 'hover:bg-gray-100'
              }
            `}
          >
            <svg
              className={`w-5 h-5 ${buttonSize === 'sm' ? 'w-4 h-4' : buttonSize === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`}
              viewBox={SocialIcons[platform].viewBox}
              fill="currentColor"
            >
              <path d={SocialIcons[platform].path} />
            </svg>
          </motion.button>
        </Tooltip>
      ))}

      {/* Copy link button */}
      <Tooltip content={copied ? 'Tersalin!' : 'Salin tautan'} position="top">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyToClipboard}
          className={`
            p-2 rounded-full transition-colors
            ${buttonVariant === 'outline' 
              ? 'border border-gray-300 hover:border-primary-500 hover:text-primary-600' 
              : 'hover:bg-gray-100'
            }
          `}
        >
          {copied ? (
            <CheckIcon className={`${buttonSize === 'sm' ? 'w-4 h-4' : buttonSize === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-green-600`} />
          ) : (
            <LinkIcon className={`${buttonSize === 'sm' ? 'w-4 h-4' : buttonSize === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`} />
          )}
        </motion.button>
      </Tooltip>

      {/* Native share button (for mobile) */}
      {navigator.share && (
        <Tooltip content="Bagikan" position="top">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigator.share({
                title,
                text: description,
                url
              }).then(() => onShare?.('native'));
            }}
            className={`
              p-2 rounded-full transition-colors
              ${buttonVariant === 'outline' 
                ? 'border border-gray-300 hover:border-primary-500 hover:text-primary-600' 
                : 'hover:bg-gray-100'
              }
            `}
          >
            <ShareIcon className={`${buttonSize === 'sm' ? 'w-4 h-4' : buttonSize === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`} />
          </motion.button>
        </Tooltip>
      )}
    </div>
  );
};

SocialShare.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  platforms: PropTypes.arrayOf(
    PropTypes.oneOf(['facebook', 'twitter', 'whatsapp', 'telegram', 'linkedin', 'email'])
  ),
  showCount: PropTypes.bool,
  onShare: PropTypes.func,
  className: PropTypes.string,
  buttonSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  buttonVariant: PropTypes.oneOf(['outline', 'ghost'])
};

export default SocialShare;