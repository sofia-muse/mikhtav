import { useTranslation } from 'react-i18next'

export function DisclaimerBanner() {
  const { t } = useTranslation()
  return (
    <div className="disclaimer-bar" role="note">
      <span className="disclaimer-tag">⚠ {t('disclaimer')}</span>
    </div>
  )
}
