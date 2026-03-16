// =====================================================
// FILE: frontend/src/hooks/useDocumentTitle.js
// DESKRIPSI: Document title hook
// =====================================================

import { useEffect, useRef } from 'react';

export const useDocumentTitle = (title, prefix = 'DarahKita') => {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = prefix ? `${prefix} - ${title}` : title;

    return () => {
      document.title = defaultTitle.current;
    };
  }, [title, prefix]);
};

// Dynamic title with params
export const useDynamicTitle = (titleTemplate, params) => {
  const getTitle = useCallback(() => {
    let title = titleTemplate;
    Object.keys(params).forEach(key => {
      title = title.replace(`{{${key}}}`, params[key]);
    });
    return title;
  }, [titleTemplate, params]);

  useDocumentTitle(getTitle());
};

// Title with unread count
export const useTitleWithCount = (baseTitle, count) => {
  const title = count > 0 ? `(${count}) ${baseTitle}` : baseTitle;
  useDocumentTitle(title);
};

// Page title hook with route
export const usePageTitle = (pageName) => {
  useDocumentTitle(pageName);
};

// Title formatter hook
export const useTitleFormatter = () => {
  const formatTitle = useCallback((page, action) => {
    if (action) {
      return `${action} ${page}`;
    }
    return page;
  }, []);

  return formatTitle;
};

// Meta tags hook
export const useMetaTags = (tags) => {
  useEffect(() => {
    const metaTags = [];

    Object.entries(tags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
        metaTags.push(meta);
      }
      
      meta.setAttribute('content', content);
    });

    return () => {
      metaTags.forEach(meta => meta.remove());
    };
  }, [tags]);
};

// Open Graph tags hook
export const useOpenGraph = (og) => {
  useEffect(() => {
    const metaTags = [];

    Object.entries(og).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="og:${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', `og:${property}`);
        document.head.appendChild(meta);
        metaTags.push(meta);
      }
      
      meta.setAttribute('content', content);
    });

    return () => {
      metaTags.forEach(meta => meta.remove());
    };
  }, [og]);
};

// Favicon hook
export const useFavicon = (href) => {
  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']");
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    link.href = href;
  }, [href]);
};