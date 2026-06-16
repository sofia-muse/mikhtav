using Mikhtav.Core.Models;

namespace Mikhtav.Infrastructure.Data;

/// <summary>
/// Seeded content. Each letter type's sections, plus the glossary, are written in HE (the label
/// as it appears on the actual letter) + EN + RU. Ukrainian is left null and falls back to EN on
/// read — we'll add UA translations in a later session.
///
/// This is educational content about common Israeli bureaucratic letters. It does not republish
/// any government data; it explains categories in general terms only.
/// </summary>
public static class SeedData
{
    public static readonly LetterCategory[] Categories =
    {
        new()
        {
            Id = 1, Slug = "bituach-leumi", Issuer = "National Insurance Institute", OrderIndex = 1,
            NameHe = "ביטוח לאומי",
            NameEn = "National Insurance",
            NameRu = "Национальное страхование",
        },
        new()
        {
            Id = 2, Slug = "mas-hachnasa", Issuer = "Israel Tax Authority", OrderIndex = 2,
            NameHe = "מס הכנסה",
            NameEn = "Income Tax",
            NameRu = "Налоговое управление",
        },
    };

    public static readonly LetterType[] LetterTypes =
    {
        new()
        {
            Id = 1, CategoryId = 1, Slug = "ishur-bituach", OrderIndex = 1,
            NameHe = "אישור ביטוח לאומי",
            NameEn = "National Insurance Enrolment Confirmation",
            NameRu = "Подтверждение регистрации в Битуах Леуми",
            SummaryEn = "Confirms that your national insurance file is active and lists the benefit categories you're enrolled in.",
            SummaryRu = "Подтверждает, что ваше дело в Битуах Леуми активно, и перечисляет категории страхования, к которым вы относитесь.",
        },
        new()
        {
            Id = 2, CategoryId = 2, Slug = "drisha-shnatit", OrderIndex = 1,
            NameHe = "הודעת דרישה שנתית",
            NameEn = "Annual Tax Demand Notice",
            NameRu = "Годовое требование об уплате налога",
            SummaryEn = "An assessment from the Tax Authority of how much you owe (or are owed) for a given tax year, with a payment or appeal deadline.",
            SummaryRu = "Расчёт Налогового управления о сумме, которую вы должны (или которая причитается вам) за налоговый год, с указанным сроком оплаты или подачи возражения.",
        },
    };

    public static readonly LetterSection[] Sections =
    {
        // --- Letter 1: Bituach Leumi enrolment confirmation ---
        new()
        {
            Id = 1, LetterTypeId = 1, OrderIndex = 1,
            LabelHe = "פרטים אישיים",
            ExplainerEn = "Personal details — check your name, ID number (teudat zehut), and address are spelled correctly. Errors here are the most common cause of payments going to the wrong person.",
            ExplainerRu = "Личные данные — проверьте, что ваше имя, номер удостоверения (теудат зеут) и адрес указаны верно. Ошибки в этой части — самая частая причина того, что выплаты приходят не тому человеку.",
            ActionRequiredEn = "If anything is wrong, contact your local Bituach Leumi branch.",
            ActionRequiredRu = "Если что-то указано неверно, обратитесь в местное отделение Битуах Леуми.",
            Severity = Severity.Warning,
        },
        new()
        {
            Id = 2, LetterTypeId = 1, OrderIndex = 2,
            LabelHe = "תאריך תחילת הביטוח",
            ExplainerEn = "Coverage start date — the date on which your national insurance enrolment becomes active. Some benefits (maternity, work injury) only apply after a qualifying period that starts from this date.",
            ExplainerRu = "Дата начала страхования — день, с которого ваше национальное страхование вступает в силу. Некоторые виды пособий (по беременности, в связи с травмой на работе) применяются только после определённого периода с этой даты.",
            Severity = Severity.Info,
        },
        new()
        {
            Id = 3, LetterTypeId = 1, OrderIndex = 3,
            LabelHe = "קטגוריות הביטוח",
            ExplainerEn = "Insurance categories — the benefit programs you're enrolled in (e.g. old age, disability, maternity, unemployment, work injury). Each category has its own eligibility rules.",
            ExplainerRu = "Категории страхования — программы пособий, к которым вы относитесь (например, по старости, инвалидности, материнству, безработице, травмам на работе). У каждой категории — свои условия.",
            Severity = Severity.Info,
        },
        new()
        {
            Id = 4, LetterTypeId = 1, OrderIndex = 4,
            LabelHe = "סכום החיוב החודשי",
            ExplainerEn = "Monthly contribution — the amount you pay (or that's deducted from your salary) each month. Self-employed or unemployed people pay directly; salaried employees usually have it withheld by the employer.",
            ExplainerRu = "Месячный взнос — сумма, которую вы платите (или которая удерживается из зарплаты) каждый месяц. Самозанятые и безработные платят напрямую; у наёмных работников взнос обычно удерживает работодатель.",
            ActionRequiredEn = "If you're self-employed, set up a standing order so payments aren't missed — late contributions can interrupt benefit eligibility.",
            ActionRequiredRu = "Если вы самозанятый, оформите автоматический платёж, чтобы не пропускать взносы — просрочки могут привести к потере права на пособия.",
            Deadline = "Monthly, on the date shown",
            Severity = Severity.Warning,
        },
        new()
        {
            Id = 5, LetterTypeId = 1, OrderIndex = 5,
            LabelHe = "פרטי יצירת קשר",
            ExplainerEn = "Contact details — phone number and address of your assigned branch. Use the case number (mispar tik) shown on the letter whenever you contact them.",
            ExplainerRu = "Контактные данные — телефон и адрес вашего отделения. При обращении всегда указывайте номер дела (миспар тик), указанный в письме.",
            Severity = Severity.Info,
        },

        // --- Letter 2: Mas Hachnasa annual demand notice ---
        new()
        {
            Id = 6, LetterTypeId = 2, OrderIndex = 1,
            LabelHe = "שנת המס",
            ExplainerEn = "Tax year — the calendar year this demand relates to. In Israel the tax year matches the calendar year (January through December).",
            ExplainerRu = "Налоговый год — календарный год, к которому относится требование. В Израиле налоговый год совпадает с календарным (январь — декабрь).",
            Severity = Severity.Info,
        },
        new()
        {
            Id = 7, LetterTypeId = 2, OrderIndex = 2,
            LabelHe = "הכנסה מדווחת",
            ExplainerEn = "Reported income — the income figure on which the tax was calculated. This is based on your or your employer's filings (Form 106 from your employer is the most common source).",
            ExplainerRu = "Заявленный доход — сумма дохода, по которой рассчитан налог. Берётся из ваших деклараций или деклараций работодателя (чаще всего из формы 106).",
            ActionRequiredEn = "Compare this figure against your own records. If it's wrong, you can dispute the demand within 30 days.",
            ActionRequiredRu = "Сверьте сумму со своими записями. Если она неверна, вы можете подать возражение в течение 30 дней.",
            Severity = Severity.Warning,
        },
        new()
        {
            Id = 8, LetterTypeId = 2, OrderIndex = 3,
            LabelHe = "סכום החוב",
            ExplainerEn = "Amount owed — the total tax due, often including penalties and interest (ribit) on any underpayment. A negative amount means you're owed a refund.",
            ExplainerRu = "Сумма задолженности — общий налог к уплате, обычно с пенями и процентами (рибит) за недоплату. Отрицательная сумма означает, что вам должны возврат.",
            Severity = Severity.Critical,
        },
        new()
        {
            Id = 9, LetterTypeId = 2, OrderIndex = 4,
            LabelHe = "מועד תשלום אחרון",
            ExplainerEn = "Payment deadline — pay by this date to avoid additional interest charges and to keep the case out of enforcement (hotza'a la-po'al).",
            ExplainerRu = "Крайний срок оплаты — заплатите до этой даты, чтобы избежать новых процентов и не попасть в исполнительное производство (hотzаа ла-поэль).",
            ActionRequiredEn = "Pay via Bank HaPoalim / online banking / the Tax Authority website. Keep proof of payment.",
            ActionRequiredRu = "Оплата возможна через Банк ха-Поалим / онлайн-банк / сайт Налогового управления. Сохраните подтверждение оплаты.",
            Deadline = "Date shown on the notice (typically 30 days)",
            Severity = Severity.Critical,
        },
        new()
        {
            Id = 10, LetterTypeId = 2, OrderIndex = 5,
            LabelHe = "אופן הגשת ערעור",
            ExplainerEn = "How to appeal — if you disagree with the calculation, file a written objection (erur) within 30 days of receiving the notice. State the tax year, case number, and the specific item you're disputing.",
            ExplainerRu = "Как подать возражение — если вы не согласны с расчётом, подайте письменное возражение (эрур) в течение 30 дней с момента получения уведомления. Укажите налоговый год, номер дела и оспариваемую позицию.",
            ActionRequiredEn = "If the amount is large, consider consulting an accountant (ro'eh cheshbon) before submitting the appeal.",
            ActionRequiredRu = "Если сумма значительная, имеет смысл проконсультироваться с бухгалтером (роэ хешбон) перед подачей возражения.",
            Deadline = "30 days from notice receipt",
            Severity = Severity.Warning,
        },
    };

    public static readonly BureauTerm[] Glossary =
    {
        new()
        {
            Id = 1, OrderIndex = 1, TermHe = "תעודת זהות", Transliteration = "Te'udat Zehut",
            MeaningEn = "Identity card. The mandatory national ID for residents — its 9-digit number identifies you to every government office.",
            MeaningRu = "Удостоверение личности. Обязательный национальный документ для жителей — его 9-значный номер используется во всех государственных учреждениях.",
        },
        new()
        {
            Id = 2, OrderIndex = 2, TermHe = "מספר תיק", Transliteration = "Mispar Tik",
            MeaningEn = "Case/file number. Always quote this number when calling or writing about a specific letter or matter.",
            MeaningRu = "Номер дела/папки. Всегда указывайте этот номер при обращении по конкретному вопросу или письму.",
        },
        new()
        {
            Id = 3, OrderIndex = 3, TermHe = "ביטוח לאומי", Transliteration = "Bituach Leumi",
            MeaningEn = "National Insurance Institute. Israel's social-security agency, handles pensions, unemployment, maternity, disability and more.",
            MeaningRu = "Битуах Леуми (Институт национального страхования) — израильское ведомство социального обеспечения: пенсии, пособия по безработице, материнству, инвалидности и т.д.",
        },
        new()
        {
            Id = 4, OrderIndex = 4, TermHe = "מס הכנסה", Transliteration = "Mas Hachnasa",
            MeaningEn = "Income Tax (Authority). The Israel Tax Authority — assesses and collects personal and corporate income tax.",
            MeaningRu = "Подоходный налог (управление). Налоговое управление Израиля — рассчитывает и собирает подоходный налог с физических и юридических лиц.",
        },
        new()
        {
            Id = 5, OrderIndex = 5, TermHe = "דרישת תשלום", Transliteration = "Drishat Tashlum",
            MeaningEn = "Payment demand. An official request to pay an outstanding amount by a stated date.",
            MeaningRu = "Требование об оплате. Официальное требование уплатить указанную сумму до определённой даты.",
        },
        new()
        {
            Id = 6, OrderIndex = 6, TermHe = "מועד אחרון", Transliteration = "Moed Acharon",
            MeaningEn = "Final deadline. The last date by which action must be taken without penalty.",
            MeaningRu = "Крайний срок. Последняя дата, до которой можно действовать без штрафа.",
        },
        new()
        {
            Id = 7, OrderIndex = 7, TermHe = "ערעור", Transliteration = "Erur",
            MeaningEn = "Appeal / objection. A formal challenge to a decision; most have a strict filing window (often 30 days).",
            MeaningRu = "Возражение / апелляция. Официальное оспаривание решения; обычно действует строгий срок подачи (часто 30 дней).",
            UsageNote = "Always submit in writing and keep proof of receipt.",
        },
        new()
        {
            Id = 8, OrderIndex = 8, TermHe = "אישור", Transliteration = "Ishur",
            MeaningEn = "Confirmation or approval. A document or letter that confirms a status, eligibility, or completed action.",
            MeaningRu = "Подтверждение или утверждение. Документ или письмо, подтверждающее статус, право или совершённое действие.",
        },
        new()
        {
            Id = 9, OrderIndex = 9, TermHe = "הסבר נלווה", Transliteration = "Hesber Nilve",
            MeaningEn = "Explanatory note. The supplementary page attached to a letter that explains the figures or decisions on the main page.",
            MeaningRu = "Пояснительная записка. Дополнительная страница к письму, поясняющая цифры или решения, указанные на основной странице.",
        },
        new()
        {
            Id = 10, OrderIndex = 10, TermHe = "סעיף", Transliteration = "Sa'if",
            MeaningEn = "Clause or section. Refers to a numbered paragraph of a law or document.",
            MeaningRu = "Пункт или раздел. Обозначает пронумерованный пункт закона или документа.",
        },
        new()
        {
            Id = 11, OrderIndex = 11, TermHe = "תוקף", Transliteration = "Tokef",
            MeaningEn = "Validity. The period during which a document, permit, or approval is in force.",
            MeaningRu = "Срок действия. Период, в течение которого документ, разрешение или одобрение действительны.",
        },
        new()
        {
            Id = 12, OrderIndex = 12, TermHe = "פטור", Transliteration = "Ptur",
            MeaningEn = "Exemption. Relief from an obligation — most commonly tax, but also fees or service requirements.",
            MeaningRu = "Льгота / освобождение. Освобождение от обязательства — чаще всего от налога, но также от сборов или иных требований.",
        },
        new()
        {
            Id = 13, OrderIndex = 13, TermHe = "הוצאה לפועל", Transliteration = "Hotza'a la-Po'al",
            MeaningEn = "Enforcement / Bailiff's Office. The civil debt-collection authority. If your case reaches here, your bank account can be frozen and assets seized.",
            MeaningRu = "Исполнительная служба (Хотzаа ла-Поэль). Гражданское ведомство по взысканию долгов. Если дело передано сюда, могут заморозить счёт и арестовать имущество.",
            UsageNote = "If you receive a letter from here, respond immediately — do not ignore it.",
        },
        new()
        {
            Id = 14, OrderIndex = 14, TermHe = "ריבית", Transliteration = "Ribit",
            MeaningEn = "Interest. Added to overdue amounts; can also refer to interest you owe or are owed under a law.",
            MeaningRu = "Проценты. Начисляются на просроченные суммы; могут также относиться к процентам, которые вы должны или которые причитаются вам по закону.",
        },
        new()
        {
            Id = 15, OrderIndex = 15, TermHe = "תקנה", Transliteration = "Takana",
            MeaningEn = "Regulation. A binding rule issued under the authority of a law. Often cited by number (e.g. \"Takana 2(a)\").",
            MeaningRu = "Положение / постановление. Обязательное правило, изданное на основании закона. Часто указывается номером (например, «Takana 2(a)»).",
        },
    };
}
