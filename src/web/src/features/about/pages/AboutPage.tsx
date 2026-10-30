import { useTranslation } from 'react-i18next'
import { AppLink, PageHeading } from '../../../shared/ui'
import styles from './about.module.css'
export function AboutPage() {
  const { t } = useTranslation('about')
  return <article className={styles.about}><PageHeading title={t('title')} description={t('body')} />{['purpose', 'originals', 'sources', 'progress'].map(key => <section key={key}><h2>{t(`${key}.title`)}</h2><p>{t(`${key}.body`)}</p></section>)}<AppLink to="/documents">{t('documents')} ↗</AppLink></article>
}
