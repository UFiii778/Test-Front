// =====================================================
// FILE: frontend/src/hooks/index.js
// DESKRIPSI: Central export for all hooks
// =====================================================

// Context hooks
export {
  useAuth,
  useUser,
  useIsAuthenticated,
  useHasRole,
  useHasAnyRole,
  useHasPermission,
  useLogin,
  useLogout,
  useRegister,
  useUpdateUser,
  useChangePassword
} from './useAuth';

export {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  useNotificationSettings,
  useNotificationSound
} from './useNotifications';

export {
  useTheme,
  useIsDark,
  useIsLight,
  useActiveTheme,
  useThemeColors,
  useToggleTheme,
  useSetTheme,
  useThemeVariable,
  useThemeClass
} from './useTheme';

export {
  useSocket,
  useSocketEvent,
  useSocketEmit,
  useSocketConnected,
  useOnlineUsers,
  useTypingUsers,
  useIsUserOnline,
  useIsUserTyping,
  useTypingIndicator
} from './useSocket';

export {
  useLanguage,
  useTranslation,
  useCurrentLanguage,
  useChangeLanguage,
  useFormatNumber,
  useFormatDate,
  useFormatCurrency,
  useFormatRelativeTime,
  useTranslate
} from './useLanguage';

export {
  useConfig,
  useConfigValue,
  useFeatureEnabled,
  useApiUrl,
  useSocketUrl,
  useEnvironment,
  useAppInfo,
  useContactInfo,
  useSocialMedia,
  usePaginationDefaults,
  useUploadLimits,
  useDateFormats,
  useMapConfig,
  useBloodTypes,
  useUrgencyLevels
} from './useConfig';

export {
  useBloodStock,
  useBloodStockList,
  useBloodStockSummary,
  useCriticalStock,
  useBloodStockFilters,
  useUpdateStock,
  useTransferStock,
  useBatchUpdate,
  useStockByLocation,
  useStockByBloodType,
  useStockForecast,
  useStockHistory,
  useRefreshBloodStock
} from './useBloodStock';

export {
  useRequest,
  useRequests,
  useMyRequests,
  useEmergencyRequests,
  useRequestStats,
  useRequestFilters,
  useCreateRequest,
  useUpdateRequestStatus,
  useCancelRequest,
  useRespondToRequest,
  useAcceptResponse,
  useDeclineResponse,
  useRequestById,
  useMatchingRequests,
  useNearbyRequests,
  useChangePage,
  useRefreshRequests
} from './useRequest';

export {
  useDashboard,
  useDashboardData,
  useDashboardStats,
  useRecentActivities,
  useUpcomingEvents,
  useDashboardNotifications,
  useWidgets,
  useWidgetConfig,
  useRoleDashboard,
  useChartData,
  usePerformanceMetrics,
  useUserGrowth,
  useDonationTrends,
  useGeoDistribution,
  useTopAreas,
  useWeeklySummary,
  useMonthlyReport,
  useExportDashboard,
  useRefreshDashboard
} from './useDashboard';

export {
  useSearch,
  useSearchQuery,
  useSearchType,
  useSearchResults,
  useRecentSearches,
  useSearchSuggestions,
  useSearchFilters,
  useSearchPagination,
  useClearSearch,
  useSearchHospitals,
  useSearchRequests,
  useSearchNews,
  useSearchUsers
} from './useSearch';

export {
  useFilter,
  useFilters,
  useActiveFilters,
  useFilterDefinitions,
  useFilterValue,
  useIsFilterActive,
  useRemoveFilter,
  useClearFilters,
  useResetToFilters,
  useActiveFilterCount,
  useMergeWithDefaults,
  useFilterPresets,
  useTextFilter,
  useSelectFilter,
  useMultiSelectFilter,
  useRangeFilter,
  useDateRangeFilter,
  useBooleanFilter
} from './useFilter';

export {
  useModal,
  useOpenModal,
  useCloseModal,
  useCloseAllModals,
  useUpdateModal,
  useConfirm,
  useConfirmDanger,
  useConfirmWarning,
  useConfirmSuccess,
  useAlert,
  usePrompt,
  useFormModal,
  useDetailModal
} from './useModal';

export {
  useToast,
  useSuccessToast,
  useErrorToast,
  useWarningToast,
  useInfoToast,
  useAddToast,
  useRemoveToast,
  useClearToasts,
  useApiToast,
  useFormToast,
  useCopyToast
} from './useToast';

export {
  useLoading,
  useStartLoading,
  useStopLoading,
  useToggleLoading,
  useIsLoading,
  useIsAnyLoading,
  useWithLoading,
  useScopedLoading,
  useApiLoading,
  useFormLoading,
  usePageLoading
} from './useLoading';

export {
  useConfirm as useConfirmDialog,
  useConfirmDanger as useDeleteConfirm,
  useConfirmWarning as useCancelConfirm,
  useConfirmSuccess as useSaveConfirm,
  useFormDirtyConfirm
} from './useConfirm';

// Utility hooks
export {
  useDebounce,
  useDebouncedCallback,
  useDebouncedSearch
} from './useDebounce';

export {
  useThrottle,
  useThrottledCallback,
  useThrottledScroll,
  useThrottledResize
} from './useThrottle';

export {
  useLocalStorage,
  useLocalStorageObject,
  useLocalStorageArray,
  useLocalStorageBoolean,
  useLocalStorageNumber,
  useLocalStorageString
} from './useLocalStorage';

export {
  useSessionStorage,
  useSessionStorageObject,
  useSessionStorageArray,
  useSessionStorageBoolean,
  useSessionStorageNumber,
  useSessionStorageString
} from './useSessionStorage';

export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
  useIsPortrait,
  useIsLandscape,
  usePrefersDarkMode,
  usePrefersLightMode,
  usePrefersReducedMotion,
  usePrefersHighContrast,
  useResponsiveValue,
  useBreakpoint,
  useResponsiveStyle
} from './useMediaQuery';

export {
  useOnClickOutside,
  useOnClickOutsideMultiple,
  useOnEscape,
  useClickOutsideAndEscape
} from './useOnClickOutside';

export {
  useIntersectionObserver,
  useLazyLoadImage,
  useInfiniteScroll,
  useVisibilityTracker
} from './useIntersectionObserver';

export {
  useWindowSize,
  useWindowWidth,
  useWindowHeight,
  useWindowOrientation,
  useVW,
  useVH,
  useVMin,
  useVMax,
  useResponsiveNumber,
  useElementSize
} from './useWindowSize';

export {
  useScrollPosition,
  useScrollDirection,
  useScrollToTop,
  useScrollToElement,
  useScrollLock,
  useInfiniteScroll as useInfiniteScrollWindow,
  useScrollProgress,
  useScrollToBottom
} from './useScrollPosition';

export {
  usePrevious,
  usePreviousState,
  usePreviousAndCurrent,
  useDidChange,
  useIncreaseDecrease,
  useIsFirstRender,
  useIsMounted,
  useUpdateCount
} from './usePrevious';

export {
  useToggle,
  useMultiToggle,
  useAccordion,
  useMenu,
  useTab,
  useStep
} from './useToggle';

export {
  useBoolean,
  useLoading as useBooleanLoading,
  useError,
  useSuccess,
  useVisibility,
  useEditMode,
  useSelected
} from './useBoolean';

export {
  useCounter,
  useCounterWithHistory,
  useCountdown,
  useProgress
} from './useCounter';

export {
  useInterval,
  usePolling,
  useTimer,
  useAnimationFrame,
  useDebouncedInterval
} from './useInterval';

export {
  useTimeout,
  useDebounce as useDebounceTimeout,
  useThrottle as useThrottleTimeout,
  useDelay,
  useRetry
} from './useTimeout';

export {
  useDocumentTitle,
  useDynamicTitle,
  useTitleWithCount,
  usePageTitle,
  useTitleFormatter,
  useMetaTags,
  useOpenGraph,
  useFavicon
} from './useDocumentTitle';

export {
  useForm,
  useFormWizard,
  useFormArray
} from './useForm';

export {
  useValidation,
  usePasswordValidation
} from './useValidation';

export {
  usePagination,
  usePaginatedData,
  useSearchPagination,
  useSortablePagination,
  useFilteredPagination
} from './usePagination';

export {
  useInfiniteScroll as useInfiniteScrollData,
  useInfiniteData,
  useInfiniteSearch,
  useWindowInfiniteScroll
} from './useInfiniteScroll';

export {
  useGeolocation,
  useNearbyLocations
} from './useGeolocation';

export {
  usePermission,
  useNotificationPermission,
  useGeolocationPermission,
  useCameraPermission,
  useMicrophonePermission,
  usePushPermission,
  usePersistentStoragePermission
} from './usePermission';

export {
  useCopyToClipboard,
  useCopyWithFallback,
  useCopyWithCallback,
  useCopyFormatted,
  useCopyJson
} from './useCopyToClipboard';

export {
  useNetworkState,
  useOnlineStatus,
  useNetworkSpeed,
  useNetworkType,
  useDataSaver,
  useConnectionQuality
} from './useNetworkState';

export {
  useOnlineStatus as useOnlineStatusSimple,
  useOnlineStatusWithDetails,
  useOnlineWithReconnect,
  useOnlineQueue,
  useOnlineSync
} from './useOnlineStatus';