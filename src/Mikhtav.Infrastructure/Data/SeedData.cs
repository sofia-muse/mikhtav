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
        new()
        {
            Id = 3, Slug = "misrad-hapnim", Issuer = "Population and Immigration Authority", OrderIndex = 3,
            NameHe = "משרד הפנים",
            NameEn = "Interior Ministry",
            NameRu = "Министерство внутренних дел",
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
            PrimaryNextStepEn = "Check that your personal details and coverage start date are correct, then set up any monthly payment the letter expects.",
            AppliesWhenEn = "you've just enrolled in national insurance or need to confirm your coverage became active",
            NeedsDocuments = false,
            RecommendedChannelEn = "Use your Bituach Leumi personal area first, then call the branch if any detail is wrong.",
            WhenToContactAuthorityEn = "your name, ID number, start date, or insurance category is missing or incorrect",
            WhatToVerifyEn = "Verify the ID number, address, coverage start date, and the insurance categories listed on the notice.",
        },
        new()
        {
            Id = 2, CategoryId = 2, Slug = "drisha-shnatit", OrderIndex = 1,
            NameHe = "הודעת דרישה שנתית",
            NameEn = "Annual Tax Demand Notice",
            NameRu = "Годовое требование об уплате налога",
            SummaryEn = "An assessment from the Tax Authority of how much you owe (or are owed) for a given tax year, with a payment or appeal deadline.",
            SummaryRu = "Расчёт Налогового управления о сумме, которую вы должны (или которая причитается вам) за налоговый год, с указанным сроком оплаты или подачи возражения.",
            PrimaryNextStepEn = "Compare the reported income and amount due against your own records before you decide whether to pay or appeal.",
            AppliesWhenEn = "the Tax Authority says you owe money or need to respond about a specific tax year",
            NeedsDocuments = true,
            RecommendedChannelEn = "Use the payment or objection channel printed on the notice and keep proof of every submission.",
            WhenToContactAuthorityEn = "the income, amount due, or deadline does not match your records",
            WhatToVerifyEn = "Verify the tax year, reported income, total amount due, and the final payment or objection deadline.",
        },
        new()
        {
            Id = 3, CategoryId = 1, Slug = "hov-bituach-leumi", OrderIndex = 2,
            NameHe = "הודעת חוב",
            NameEn = "National Insurance Debt Notice",
            NameRu = "Уведомление о долге в Битуах Леуми",
            SummaryEn = "Explains that unpaid contributions or a benefit recalculation left an outstanding balance, with payment, instalment, or objection steps.",
            SummaryRu = "Объясняет, что из-за неуплаченных взносов или перерасчёта пособия образовалась задолженность, и указывает шаги для оплаты, рассрочки или возражения.",
            PrimaryNextStepEn = "Confirm the reason for the debt, then either pay, ask for instalments, or dispute it in writing right away.",
            AppliesWhenEn = "unpaid national insurance contributions or a recalculation created an outstanding balance",
            NeedsDocuments = true,
            RecommendedChannelEn = "Respond through the branch or payment route printed on the notice and keep the receipt or case reference.",
            WhenToContactAuthorityEn = "you already paid, the debt reason is wrong, or you need an instalment plan before the deadline",
            WhatToVerifyEn = "Verify the charged period, reason for the debt, total amount due, and the last payment date.",
        },
        new()
        {
            Id = 4, CategoryId = 1, Slug = "bakashat-mismachim-bituach", OrderIndex = 3,
            NameHe = "בקשה להמצאת מסמכים",
            NameEn = "National Insurance Request For Supporting Documents",
            NameRu = "Запрос Битуах Леуми о предоставлении документов",
            SummaryEn = "Requests payslips, identity records, or other proofs so a benefit claim or insurance status can be decided.",
            SummaryRu = "Запрашивает расчётные листы, документы, удостоверяющие личность, или иные подтверждения, чтобы можно было принять решение по пособию или страховому статусу.",
            PrimaryNextStepEn = "Collect every document listed on the notice and submit them through the named channel before the deadline.",
            AppliesWhenEn = "Bituach Leumi cannot finish a claim or status review until you prove something with documents",
            NeedsDocuments = true,
            RecommendedChannelEn = "Use the exact upload, email, fax, or branch channel listed on the request.",
            WhenToContactAuthorityEn = "you cannot get the documents in time or the request names documents that do not fit your case",
            WhatToVerifyEn = "Verify which claim this request belongs to, the exact document list, and the submission deadline.",
        },
        new()
        {
            Id = 5, CategoryId = 2, Slug = "drishat-hokhahat-hachnasa", OrderIndex = 2,
            NameHe = "דרישה להוכחת הכנסה",
            NameEn = "Income Verification Request",
            NameRu = "Требование подтвердить доход",
            SummaryEn = "Requests documents that support the income used in a tax assessment, refund review, or credit check.",
            SummaryRu = "Запрашивает документы, подтверждающие доход, использованный при расчёте налога, проверке возврата или налоговых льгот.",
            PrimaryNextStepEn = "Match the request against your tax records, then send the listed proofs and a short explanation before the response deadline.",
            AppliesWhenEn = "the Tax Authority sees a mismatch or needs more proof for income, credits, or a refund review",
            NeedsDocuments = true,
            RecommendedChannelEn = "Submit the documents through the tax portal or office channel named on the letter.",
            WhenToContactAuthorityEn = "the request refers to the wrong tax year, wrong taxpayer, or documents you cannot reasonably provide",
            WhatToVerifyEn = "Verify the tax year, case number, discrepancy described, and the deadline for replying.",
        },
        new()
        {
            Id = 6, CategoryId = 2, Slug = "hodaat-hekhzer-mas", OrderIndex = 3,
            NameHe = "הודעה על החזר מס",
            NameEn = "Tax Refund Notice",
            NameRu = "Уведомление о возврате налога",
            SummaryEn = "Confirms that the Tax Authority owes you money for a tax year and shows how and when the refund will be paid.",
            SummaryRu = "Подтверждает, что Налоговое управление должно вам деньги за налоговый год, и показывает, как и когда будет выплачен возврат.",
            PrimaryNextStepEn = "Check that the refund amount and bank details are correct, then monitor the payment window before following up.",
            AppliesWhenEn = "the Tax Authority says you overpaid and plans to send money back",
            NeedsDocuments = false,
            RecommendedChannelEn = "Use the refund inquiry channel printed on the notice if the transfer is delayed or the bank details changed.",
            WhenToContactAuthorityEn = "the bank account is outdated, the amount seems wrong, or the refund does not arrive in the stated window",
            WhatToVerifyEn = "Verify the tax year, refund amount, receiving bank account, and expected transfer timing.",
        },
        new()
        {
            Id = 7, CategoryId = 3, Slug = "chidush-teudat-zehut", OrderIndex = 1,
            NameHe = "הודעה לחידוש תעודת זהות",
            NameEn = "ID Card Renewal Notice",
            NameRu = "Уведомление о продлении удостоверения личности",
            SummaryEn = "Invites you to renew an expiring ID card and explains the appointment, biometric, payment, and document steps.",
            SummaryRu = "Приглашает продлить истекающее удостоверение личности и объясняет шаги по записи, биометрии, оплате и документам.",
            PrimaryNextStepEn = "Book or confirm the appointment, then gather the ID, passport, payment receipt, and any address or name-change documents.",
            AppliesWhenEn = "your ID card is expiring or the Interior Ministry is prompting you to renew it",
            NeedsDocuments = true,
            RecommendedChannelEn = "Use the booking route or bureau details printed on the notice before arriving in person.",
            WhenToContactAuthorityEn = "you cannot get an appointment, your personal details are wrong, or you need to update status information",
            WhatToVerifyEn = "Verify the renewal date, bureau, required documents, fee details, and whether a biometric visit is required.",
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

        // --- Letter 3: Bituach Leumi debt notice ---
        new()
        {
            Id = 11, LetterTypeId = 3, OrderIndex = 1,
            LabelHe = "מספר תיק / תקופת החיוב",
            ExplainerEn = "Case number and charge period — identifies the exact insurance account and the months the debt relates to. Use this reference in every phone call or written response.",
            ExplainerRu = "Номер дела и период начисления — определяют конкретный страховой счёт и месяцы, к которым относится долг. Используйте эту ссылку при каждом звонке или письменном ответе.",
            Severity = Severity.Info,
        },
        new()
        {
            Id = 12, LetterTypeId = 3, OrderIndex = 2,
            LabelHe = "סיבת החוב",
            ExplainerEn = "Reason for the debt — usually unpaid monthly contributions, an employer reporting gap, or a benefit that was later recalculated. This section tells you what triggered the balance.",
            ExplainerRu = "Причина долга — обычно это неуплаченные ежемесячные взносы, расхождение в отчётности работодателя или последующий перерасчёт пособия. Этот раздел объясняет, что вызвало задолженность.",
            ActionRequiredEn = "Compare the stated reason against your own payslips, direct-debit records, or prior benefit letters.",
            ActionRequiredRu = "Сверьте указанную причину со своими расчётными листами, банковскими списаниями или предыдущими письмами о пособиях.",
            Severity = Severity.Warning,
        },
        new()
        {
            Id = 13, LetterTypeId = 3, OrderIndex = 3,
            LabelHe = "סכום לתשלום",
            ExplainerEn = "Amount due — the total outstanding balance, often including linkage and interest. Check whether the figure is one payment or the remaining balance after earlier deductions.",
            ExplainerRu = "Сумма к оплате — общая задолженность, часто включая индексацию и проценты. Проверьте, указана ли это разовая сумма или остаток после предыдущих удержаний.",
            Severity = Severity.Critical,
        },
        new()
        {
            Id = 14, LetterTypeId = 3, OrderIndex = 4,
            LabelHe = "מועד אחרון לתשלום",
            ExplainerEn = "Final payment date — pay by this date to avoid extra interest or collection action. Debt that stays open can affect benefit eligibility and future reimbursements.",
            ExplainerRu = "Крайний срок оплаты — оплатите до этой даты, чтобы избежать дополнительных процентов или взыскания. Непогашенный долг может повлиять на право на пособия и будущие выплаты.",
            ActionRequiredEn = "If you can pay in full, do it using the payment details on the notice and keep the receipt.",
            ActionRequiredRu = "Если можете оплатить полностью, сделайте это по реквизитам из уведомления и сохраните подтверждение.",
            Deadline = "Pay by the date shown on the notice",
            Severity = Severity.Critical,
        },
        new()
        {
            Id = 15, LetterTypeId = 3, OrderIndex = 5,
            LabelHe = "בקשה לפריסת תשלומים / השגה",
            ExplainerEn = "Instalment plan or objection — if the amount is wrong or unaffordable, this section points you to request a payment arrangement or file a challenge with supporting documents.",
            ExplainerRu = "Рассрочка или возражение — если сумма неверна или непосильна, этот раздел подсказывает, как попросить график платежей или подать возражение с подтверждающими документами.",
            ActionRequiredEn = "Ask for instalments immediately if you cannot pay at once; if you dispute the debt, submit the objection in writing with evidence.",
            ActionRequiredRu = "Сразу попросите рассрочку, если не можете оплатить всю сумму; если оспариваете долг, подайте письменное возражение с доказательствами.",
            Deadline = "As early as possible, ideally before the payment deadline",
            Severity = Severity.Warning,
        },

        // --- Letter 4: Bituach Leumi request for documents ---
        new()
        {
            Id = 16, LetterTypeId = 4, OrderIndex = 1,
            LabelHe = "מספר תיק / סוג הבקשה",
            ExplainerEn = "Case number and request type — identifies which claim or insurance matter is waiting for evidence. It may relate to unemployment, maternity, residency, or self-employed status.",
            ExplainerRu = "Номер дела и тип запроса — указывают, по какому пособию или страховому вопросу ждут документы. Это может касаться безработицы, материнства, резидентства или статуса самозанятого.",
            Severity = Severity.Info,
        },
        new()
        {
            Id = 17, LetterTypeId = 4, OrderIndex = 2,
            LabelHe = "מסמכים נדרשים",
            ExplainerEn = "Requested documents — the exact proofs they need, such as payslips, employer confirmations, passport pages, entry records, or bank statements.",
            ExplainerRu = "Требуемые документы — точные подтверждения, которые нужны: расчётные листы, справки работодателя, страницы паспорта, записи о въезде или банковские выписки.",
            ActionRequiredEn = "Gather every listed document exactly as named; missing even one item can pause the claim.",
            ActionRequiredRu = "Соберите каждый указанный документ точно по списку; отсутствие даже одного пункта может остановить рассмотрение.",
            Severity = Severity.Warning,
        },
        new()
        {
            Id = 18, LetterTypeId = 4, OrderIndex = 3,
            LabelHe = "אופן ההגשה",
            ExplainerEn = "How to submit — tells you whether to upload in the personal area, email the branch, fax, or appear in person. Each channel may need the case number on every page.",
            ExplainerRu = "Как подать — сообщает, нужно ли загрузить документы в личный кабинет, отправить по электронной почте, факсу или принести лично. Для каждого канала может требоваться номер дела на каждой странице.",
            ActionRequiredEn = "Use the submission method named on the notice and keep the confirmation number or screenshot.",
            ActionRequiredRu = "Используйте способ подачи, указанный в письме, и сохраните номер подтверждения или снимок экрана.",
            Severity = Severity.Warning,
        },
        new()
        {
            Id = 19, LetterTypeId = 4, OrderIndex = 4,
            LabelHe = "מועד אחרון להמצאת מסמכים",
            ExplainerEn = "Document deadline — the date by which the branch expects the files. Missing it can freeze the case or lead to a decision without the evidence you wanted considered.",
            ExplainerRu = "Крайний срок подачи документов — дата, к которой отделение ждёт файлы. Пропуск срока может заморозить дело или привести к решению без учёта ваших доказательств.",
            ActionRequiredEn = "If you cannot gather everything in time, contact the branch before the deadline and ask for an extension.",
            ActionRequiredRu = "Если не успеваете собрать всё вовремя, свяжитесь с отделением до истечения срока и попросите продление.",
            Deadline = "Submit by the date shown on the notice",
            Severity = Severity.Critical,
        },
        new()
        {
            Id = 20, LetterTypeId = 4, OrderIndex = 5,
            LabelHe = "המשך טיפול בבקשה",
            ExplainerEn = "What happens next — explains whether payment, eligibility review, or case reopening will continue after the documents arrive.",
            ExplainerRu = "Что будет дальше — объясняет, продолжится ли выплата, проверка права или повторное открытие дела после получения документов.",
            Severity = Severity.Info,
        },

        // --- Letter 5: Tax Authority income verification request ---
        new()
        {
            Id = 21, LetterTypeId = 5, OrderIndex = 1,
            LabelHe = "שנת המס / מספר תיק",
            ExplainerEn = "Tax year and case number — identifies which filing period or review the request belongs to. Keep both numbers in front of you before you respond.",
            ExplainerRu = "Налоговый год и номер дела — показывают, к какому периоду отчётности или проверке относится запрос. Держите оба номера под рукой перед ответом.",
            Severity = Severity.Info,
        },
        new()
        {
            Id = 22, LetterTypeId = 5, OrderIndex = 2,
            LabelHe = "מסמכים נדרשים",
            ExplainerEn = "Requested proofs — commonly Form 106, payslips, invoicing records, pension statements, or bank confirmations that support the declared income.",
            ExplainerRu = "Требуемые подтверждения — обычно это форма 106, расчётные листы, счета, пенсионные выписки или банковские подтверждения, подтверждающие заявленный доход.",
            ActionRequiredEn = "Prepare clear copies of every document listed; incomplete submissions often trigger another demand.",
            ActionRequiredRu = "Подготовьте чёткие копии каждого указанного документа; неполная подача часто вызывает повторное требование.",
            Severity = Severity.Warning,
        },
        new()
        {
            Id = 23, LetterTypeId = 5, OrderIndex = 3,
            LabelHe = "פער בדיווח",
            ExplainerEn = "Reporting discrepancy — this section usually hints at the mismatch they noticed, such as income reported by an employer that does not match your return.",
            ExplainerRu = "Расхождение в отчётности — этот раздел обычно указывает, какое несоответствие они заметили, например доход, сообщённый работодателем, не совпадает с вашей декларацией.",
            ActionRequiredEn = "Write down your explanation before you respond so the documents and your written note tell the same story.",
            ActionRequiredRu = "Заранее запишите своё объяснение, чтобы документы и письменное пояснение не противоречили друг другу.",
            Severity = Severity.Warning,
        },
        new()
        {
            Id = 24, LetterTypeId = 5, OrderIndex = 4,
            LabelHe = "מועד למענה",
            ExplainerEn = "Response deadline — the date by which the Tax Authority expects the documents or explanation. Missing it can delay a refund or cause the assessment to stand as-is.",
            ExplainerRu = "Крайний срок ответа — дата, к которой Налоговое управление ожидает документы или объяснение. Пропуск срока может задержать возврат или привести к сохранению текущего расчёта.",
            ActionRequiredEn = "Respond before the deadline even if you only have part of the file; attach a note explaining what is still coming.",
            ActionRequiredRu = "Ответьте до истечения срока даже если у вас пока только часть документов; приложите записку с пояснением, что ещё будет дослано.",
            Deadline = "By the date printed on the letter",
            Severity = Severity.Critical,
        },
        new()
        {
            Id = 25, LetterTypeId = 5, OrderIndex = 5,
            LabelHe = "אופן ההגשה",
            ExplainerEn = "Submission channel — may direct you to the personal tax portal, secure email, or the local assessing office. The notice sometimes names a specific clerk or office code.",
            ExplainerRu = "Канал подачи — может направлять вас в личный налоговый кабинет, защищённую почту или местное отделение. В письме иногда указывается конкретный сотрудник или код офиса.",
            ActionRequiredEn = "Send the material through the exact channel listed and keep the submission confirmation.",
            ActionRequiredRu = "Отправьте материалы именно через указанный канал и сохраните подтверждение подачи.",
            Severity = Severity.Warning,
        },

        // --- Letter 6: Tax refund notice ---
        new()
        {
            Id = 26, LetterTypeId = 6, OrderIndex = 1,
            LabelHe = "שנת המס",
            ExplainerEn = "Tax year — tells you which year the refund calculation applies to. Make sure it matches the period you expected to review.",
            ExplainerRu = "Налоговый год — показывает, к какому году относится расчёт возврата. Убедитесь, что он совпадает с периодом, который вы ожидали.",
            Severity = Severity.Info,
        },
        new()
        {
            Id = 27, LetterTypeId = 6, OrderIndex = 2,
            LabelHe = "סכום ההחזר",
            ExplainerEn = "Refund amount — the sum the Tax Authority believes should be returned to you after offsets, credits, and prior payments are taken into account.",
            ExplainerRu = "Сумма возврата — сумма, которую Налоговое управление считает подлежащей возврату после зачёта вычетов, льгот и предыдущих платежей.",
            Severity = Severity.Info,
        },
        new()
        {
            Id = 28, LetterTypeId = 6, OrderIndex = 3,
            LabelHe = "פרטי חשבון בנק",
            ExplainerEn = "Bank account details — shows where the refund will be sent. If the account is closed or belongs to the wrong person, the transfer can bounce or be held.",
            ExplainerRu = "Банковские реквизиты — показывают, куда будет отправлен возврат. Если счёт закрыт или принадлежит другому человеку, перевод может быть отклонён или задержан.",
            ActionRequiredEn = "Check the account number carefully and update it immediately if it is outdated.",
            ActionRequiredRu = "Тщательно проверьте номер счёта и немедленно обновите его, если он устарел.",
            Severity = Severity.Warning,
        },
        new()
        {
            Id = 29, LetterTypeId = 6, OrderIndex = 4,
            LabelHe = "מועד ההעברה",
            ExplainerEn = "Transfer timing — gives the expected payment window or the next processing date. Refunds can take longer if identity or banking details still need validation.",
            ExplainerRu = "Срок перевода — указывает ожидаемое окно выплаты или следующую дату обработки. Возврат может занять больше времени, если ещё нужно подтвердить личность или банковские данные.",
            Deadline = "The transfer is usually made by the date or processing window shown",
            Severity = Severity.Info,
        },
        new()
        {
            Id = 30, LetterTypeId = 6, OrderIndex = 5,
            LabelHe = "בירור או תיקון",
            ExplainerEn = "Inquiry or correction — explains how to contact the office if the amount looks wrong, the bank details have changed, or the refund has not arrived.",
            ExplainerRu = "Уточнение или исправление — объясняет, как связаться с отделением, если сумма кажется неверной, банковские реквизиты изменились или возврат не поступил.",
            ActionRequiredEn = "Contact the office if the refund is missing after the stated window and keep the letter number ready.",
            ActionRequiredRu = "Свяжитесь с отделением, если возврат не поступил после указанного срока, и держите номер письма под рукой.",
            Severity = Severity.Warning,
        },

        // --- Letter 7: Interior Ministry ID renewal notice ---
        new()
        {
            Id = 31, LetterTypeId = 7, OrderIndex = 1,
            LabelHe = "מועד לחידוש",
            ExplainerEn = "Renewal timing — tells you when your current ID expires or when the authority expects you to renew it. Do not leave it to the last week if you need the document for travel or banking.",
            ExplainerRu = "Срок продления — показывает, когда истекает ваше текущее удостоверение личности или когда ведомство ожидает его продления. Не откладывайте на последнюю неделю, если документ нужен для поездок или банка.",
            Deadline = "Renew before the date shown on the notice",
            Severity = Severity.Warning,
        },
        new()
        {
            Id = 32, LetterTypeId = 7, OrderIndex = 2,
            LabelHe = "פרטים אישיים",
            ExplainerEn = "Personal details — check your Hebrew and English names, ID number, and current address. Errors here can carry forward into the renewed document.",
            ExplainerRu = "Личные данные — проверьте имя на иврите и английском, номер удостоверения и текущий адрес. Ошибки здесь могут перейти в новый документ.",
            ActionRequiredEn = "Flag any spelling or address error before the appointment so you know what supporting proof to bring.",
            ActionRequiredRu = "Заранее отметьте любую ошибку в написании или адресе, чтобы знать, какие подтверждения взять на приём.",
            Severity = Severity.Warning,
        },
        new()
        {
            Id = 33, LetterTypeId = 7, OrderIndex = 3,
            LabelHe = "מסמכים להביא",
            ExplainerEn = "Documents to bring — usually the current ID card, passport, proof of address if something changed, and any name-change or status documents that apply to you.",
            ExplainerRu = "Документы, которые нужно принести — обычно это текущее удостоверение личности, паспорт, подтверждение адреса при изменениях и любые документы о смене имени или статуса, если это относится к вам.",
            ActionRequiredEn = "Prepare the originals, not only copies, unless the notice explicitly says uploaded scans are enough.",
            ActionRequiredRu = "Подготовьте оригиналы, а не только копии, если в письме прямо не сказано, что достаточно сканов.",
            Severity = Severity.Warning,
        },
        new()
        {
            Id = 34, LetterTypeId = 7, OrderIndex = 4,
            LabelHe = "אגרה / תשלום",
            ExplainerEn = "Fee or payment reference — explains whether a renewal fee is due and how to pay it before or during the appointment.",
            ExplainerRu = "Пошлина или реквизиты оплаты — объясняет, нужно ли платить за продление и как это сделать до приёма или во время него.",
            ActionRequiredEn = "Pay in advance if the notice allows it and keep the receipt with your documents.",
            ActionRequiredRu = "Оплатите заранее, если письмо это позволяет, и держите квитанцию вместе с документами.",
            Severity = Severity.Info,
        },
        new()
        {
            Id = 35, LetterTypeId = 7, OrderIndex = 5,
            LabelHe = "זימון תור / לשכה",
            ExplainerEn = "Appointment and branch details — tells you which bureau to attend and whether you need to book a slot. Biometric renewals usually require an in-person visit.",
            ExplainerRu = "Детали записи и отделения — показывают, в какое бюро нужно прийти и требуется ли предварительная запись. Биометрическое продление обычно требует личного визита.",
            ActionRequiredEn = "Book the appointment as soon as possible if no slot has been assigned yet.",
            ActionRequiredRu = "Запишитесь как можно раньше, если вам ещё не назначили время.",
            Deadline = "Book or attend by the date shown on the notice",
            Severity = Severity.Critical,
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
        new()
        {
            Id = 16, OrderIndex = 16, TermHe = "חוב", Transliteration = "Hov",
            MeaningEn = "Debt. A sum the authority says you still owe, often with interest or linkage added until it is paid.",
            MeaningRu = "Долг. Сумма, которую ведомство считает непогашенной; к ней могут добавляться проценты и индексация до оплаты.",
        },
        new()
        {
            Id = 17, OrderIndex = 17, TermHe = "פריסת תשלומים", Transliteration = "Prisat Tashlumim",
            MeaningEn = "Instalment plan. An approved schedule that lets you pay a debt over several payments instead of all at once.",
            MeaningRu = "Рассрочка платежей. Утверждённый график, который позволяет платить долг несколькими платежами, а не одной суммой.",
        },
        new()
        {
            Id = 18, OrderIndex = 18, TermHe = "השלמת מסמכים", Transliteration = "Hashlamat Mismachim",
            MeaningEn = "Document completion. A request to submit missing proofs before an office can finish processing your case.",
            MeaningRu = "Досылка документов. Требование предоставить недостающие подтверждения, прежде чем ведомство завершит обработку вашего дела.",
        },
        new()
        {
            Id = 19, OrderIndex = 19, TermHe = "החזר מס", Transliteration = "Hekhzer Mas",
            MeaningEn = "Tax refund. Money returned after the Tax Authority determines you paid more than you owed.",
            MeaningRu = "Возврат налога. Деньги, которые возвращают после того, как Налоговое управление определит, что вы заплатили больше положенного.",
        },
        new()
        {
            Id = 20, OrderIndex = 20, TermHe = "זימון תור", Transliteration = "Zimun Tor",
            MeaningEn = "Appointment booking. A reservation for a branch visit, often required before biometric or document services.",
            MeaningRu = "Запись на приём. Бронирование визита в отделение, которое часто требуется перед биометрическими или документальными услугами.",
        },
    };
}
