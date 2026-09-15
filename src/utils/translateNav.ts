import { TFunction } from 'i18next';
import { NavigationTab } from '../context/AppContext';

export const getLocalizedNavLabel = (
  tabId: NavigationTab,
  fallbackLabel: string,
  t: TFunction
): string => {
  switch (tabId) {
    case 'Dashboard':
      return t('nav.dashboard', fallbackLabel);
    case 'Projects':
      return fallbackLabel.includes('&') || fallbackLabel.toLowerCase().includes('scrutiny')
        ? t('nav.projectsScrutiny', fallbackLabel)
        : t('nav.projects', fallbackLabel);
    case 'Land Parcels':
      return t('nav.landParcels', fallbackLabel);
    case 'Notifications':
      return t('nav.notifications', fallbackLabel);
    case 'Awards':
      return t('nav.awards', fallbackLabel);
    case 'Compensation':
      return fallbackLabel.includes('PFMS')
        ? t('nav.compensationPfms', fallbackLabel)
        : t('nav.compensation', fallbackLabel);
    case 'Possession':
      return fallbackLabel.includes('Handover')
        ? t('nav.possessionHandover', fallbackLabel)
        : t('nav.possession', fallbackLabel);
    case 'Rehabilitation & Resettlement':
      return fallbackLabel.toLowerCase().includes('management')
        ? t('nav.rrManagement', fallbackLabel)
        : t('nav.rr', fallbackLabel);
    case 'GIS Map':
      return fallbackLabel.toLowerCase().includes('cadastral')
        ? t('nav.gisCadastralMap', fallbackLabel)
        : t('nav.gisMap', fallbackLabel);
    case 'Grievances':
      return t('nav.grievances', fallbackLabel);
    case 'Reports':
      return fallbackLabel.toLowerCase().includes('analytics')
        ? t('nav.reportsAnalytics', fallbackLabel)
        : fallbackLabel.toLowerCase().includes('export')
        ? t('nav.reportsExports', fallbackLabel)
        : t('nav.reports', fallbackLabel);
    case 'Audit Trail':
      return fallbackLabel.toLowerCase().includes('hash')
        ? t('nav.auditTrailHashes', fallbackLabel)
        : t('nav.auditTrail', fallbackLabel);
    case 'Public Portal':
      return t('nav.citizenPortal', fallbackLabel);
    case 'Settings':
      return fallbackLabel.toLowerCase().includes('integration')
        ? t('nav.settingsIntegrations', fallbackLabel)
        : t('nav.settings', fallbackLabel);
    default:
      return fallbackLabel;
  }
};
