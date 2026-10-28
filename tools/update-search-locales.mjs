import { readFileSync, writeFileSync } from 'node:fs'
const translations = {
  en: ['Find your letter', 'Search a title, Hebrew phrase, or authority…', 'Only letters requiring action', '{{count}} letters found', 'Clear filters', 'No letters match. Try another phrase or clear the filters.', 'Search Hebrew, transliteration, or meaning…'],
  ru: ['Найдите своё письмо', 'Название, фраза на иврите или ведомство…', 'Только письма, требующие действий', 'Найдено писем: {{count}}', 'Сбросить фильтры', 'Писем не найдено. Измените запрос или сбросьте фильтры.', 'Поиск по ивриту, транслитерации или значению…'],
  he: ['מצאו את המכתב שלכם', 'חיפוש לפי כותרת, ביטוי או רשות…', 'רק מכתבים הדורשים פעולה', 'נמצאו {{count}} מכתבים', 'ניקוי מסננים', 'לא נמצאו מכתבים. נסו ביטוי אחר או נקו את המסננים.', 'חיפוש לפי מונח, תעתיק או משמעות…'],
  uk: ['Знайдіть свій лист', 'Назва, фраза івритом або установа…', 'Лише листи, що потребують дій', 'Знайдено листів: {{count}}', 'Скинути фільтри', 'Листів не знайдено. Змініть запит або скиньте фільтри.', 'Пошук за івритом, транслітерацією або значенням…'],
}
for (const [locale, values] of Object.entries(translations)) {
  const path = `src/web/src/locales/${locale}.json`
  const data = JSON.parse(readFileSync(path, 'utf8'))
  data.search = Object.fromEntries(['label', 'placeholder', 'actionOnly', 'count', 'clear', 'empty', 'glossaryPlaceholder'].map((key, i) => [key, values[i]]))
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
}
