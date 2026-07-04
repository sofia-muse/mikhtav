using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mikhtav.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ExpandUsefulLetterCoverage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Issuer", "NameEn", "NameHe", "NameRu", "NameUk", "OrderIndex", "Slug" },
                values: new object[] { 3, "Population and Immigration Authority", "Interior Ministry", "משרד הפנים", "Министерство внутренних дел", null, 3, "misrad-hapnim" });

            migrationBuilder.InsertData(
                table: "Glossary",
                columns: new[] { "Id", "MeaningEn", "MeaningRu", "MeaningUk", "OrderIndex", "TermHe", "Transliteration", "UsageNote" },
                values: new object[,]
                {
                    { 16, "Debt. A sum the authority says you still owe, often with interest or linkage added until it is paid.", "Долг. Сумма, которую ведомство считает непогашенной; к ней могут добавляться проценты и индексация до оплаты.", null, 16, "חוב", "Hov", null },
                    { 17, "Instalment plan. An approved schedule that lets you pay a debt over several payments instead of all at once.", "Рассрочка платежей. Утверждённый график, который позволяет платить долг несколькими платежами, а не одной суммой.", null, 17, "פריסת תשלומים", "Prisat Tashlumim", null },
                    { 18, "Document completion. A request to submit missing proofs before an office can finish processing your case.", "Досылка документов. Требование предоставить недостающие подтверждения, прежде чем ведомство завершит обработку вашего дела.", null, 18, "השלמת מסמכים", "Hashlamat Mismachim", null },
                    { 19, "Tax refund. Money returned after the Tax Authority determines you paid more than you owed.", "Возврат налога. Деньги, которые возвращают после того, как Налоговое управление определит, что вы заплатили больше положенного.", null, 19, "החזר מס", "Hekhzer Mas", null },
                    { 20, "Appointment booking. A reservation for a branch visit, often required before biometric or document services.", "Запись на приём. Бронирование визита в отделение, которое часто требуется перед биометрическими или документальными услугами.", null, 20, "זימון תור", "Zimun Tor", null }
                });

            migrationBuilder.InsertData(
                table: "Letters",
                columns: new[] { "Id", "CategoryId", "NameEn", "NameHe", "NameRu", "NameUk", "OrderIndex", "Slug", "SummaryEn", "SummaryRu", "SummaryUk" },
                values: new object[,]
                {
                    { 3, 1, "National Insurance Debt Notice", "הודעת חוב", "Уведомление о долге в Битуах Леуми", null, 2, "hov-bituach-leumi", "Explains that unpaid contributions or a benefit recalculation left an outstanding balance, with payment, instalment, or objection steps.", "Объясняет, что из-за неуплаченных взносов или перерасчёта пособия образовалась задолженность, и указывает шаги для оплаты, рассрочки или возражения.", null },
                    { 4, 1, "National Insurance Request For Supporting Documents", "בקשה להמצאת מסמכים", "Запрос Битуах Леуми о предоставлении документов", null, 3, "bakashat-mismachim-bituach", "Requests payslips, identity records, or other proofs so a benefit claim or insurance status can be decided.", "Запрашивает расчётные листы, документы, удостоверяющие личность, или иные подтверждения, чтобы можно было принять решение по пособию или страховому статусу.", null },
                    { 5, 2, "Income Verification Request", "דרישה להוכחת הכנסה", "Требование подтвердить доход", null, 2, "drishat-hokhahat-hachnasa", "Requests documents that support the income used in a tax assessment, refund review, or credit check.", "Запрашивает документы, подтверждающие доход, использованный при расчёте налога, проверке возврата или налоговых льгот.", null },
                    { 6, 2, "Tax Refund Notice", "הודעה על החזר מס", "Уведомление о возврате налога", null, 3, "hodaat-hekhzer-mas", "Confirms that the Tax Authority owes you money for a tax year and shows how and when the refund will be paid.", "Подтверждает, что Налоговое управление должно вам деньги за налоговый год, и показывает, как и когда будет выплачен возврат.", null },
                    { 7, 3, "ID Card Renewal Notice", "הודעה לחידוש תעודת זהות", "Уведомление о продлении удостоверения личности", null, 1, "chidush-teudat-zehut", "Invites you to renew an expiring ID card and explains the appointment, biometric, payment, and document steps.", "Приглашает продлить истекающее удостоверение личности и объясняет шаги по записи, биометрии, оплате и документам.", null }
                });

            migrationBuilder.InsertData(
                table: "Sections",
                columns: new[] { "Id", "ActionRequiredEn", "ActionRequiredRu", "ActionRequiredUk", "Deadline", "ExplainerEn", "ExplainerRu", "ExplainerUk", "LabelHe", "LetterTypeId", "OrderIndex", "Severity" },
                values: new object[,]
                {
                    { 11, null, null, null, null, "Case number and charge period — identifies the exact insurance account and the months the debt relates to. Use this reference in every phone call or written response.", "Номер дела и период начисления — определяют конкретный страховой счёт и месяцы, к которым относится долг. Используйте эту ссылку при каждом звонке или письменном ответе.", null, "מספר תיק / תקופת החיוב", 3, 1, 0 },
                    { 12, "Compare the stated reason against your own payslips, direct-debit records, or prior benefit letters.", "Сверьте указанную причину со своими расчётными листами, банковскими списаниями или предыдущими письмами о пособиях.", null, null, "Reason for the debt — usually unpaid monthly contributions, an employer reporting gap, or a benefit that was later recalculated. This section tells you what triggered the balance.", "Причина долга — обычно это неуплаченные ежемесячные взносы, расхождение в отчётности работодателя или последующий перерасчёт пособия. Этот раздел объясняет, что вызвало задолженность.", null, "סיבת החוב", 3, 2, 1 },
                    { 13, null, null, null, null, "Amount due — the total outstanding balance, often including linkage and interest. Check whether the figure is one payment or the remaining balance after earlier deductions.", "Сумма к оплате — общая задолженность, часто включая индексацию и проценты. Проверьте, указана ли это разовая сумма или остаток после предыдущих удержаний.", null, "סכום לתשלום", 3, 3, 2 },
                    { 14, "If you can pay in full, do it using the payment details on the notice and keep the receipt.", "Если можете оплатить полностью, сделайте это по реквизитам из уведомления и сохраните подтверждение.", null, "Pay by the date shown on the notice", "Final payment date — pay by this date to avoid extra interest or collection action. Debt that stays open can affect benefit eligibility and future reimbursements.", "Крайний срок оплаты — оплатите до этой даты, чтобы избежать дополнительных процентов или взыскания. Непогашенный долг может повлиять на право на пособия и будущие выплаты.", null, "מועד אחרון לתשלום", 3, 4, 2 },
                    { 15, "Ask for instalments immediately if you cannot pay at once; if you dispute the debt, submit the objection in writing with evidence.", "Сразу попросите рассрочку, если не можете оплатить всю сумму; если оспариваете долг, подайте письменное возражение с доказательствами.", null, "As early as possible, ideally before the payment deadline", "Instalment plan or objection — if the amount is wrong or unaffordable, this section points you to request a payment arrangement or file a challenge with supporting documents.", "Рассрочка или возражение — если сумма неверна или непосильна, этот раздел подсказывает, как попросить график платежей или подать возражение с подтверждающими документами.", null, "בקשה לפריסת תשלומים / השגה", 3, 5, 1 },
                    { 16, null, null, null, null, "Case number and request type — identifies which claim or insurance matter is waiting for evidence. It may relate to unemployment, maternity, residency, or self-employed status.", "Номер дела и тип запроса — указывают, по какому пособию или страховому вопросу ждут документы. Это может касаться безработицы, материнства, резидентства или статуса самозанятого.", null, "מספר תיק / סוג הבקשה", 4, 1, 0 },
                    { 17, "Gather every listed document exactly as named; missing even one item can pause the claim.", "Соберите каждый указанный документ точно по списку; отсутствие даже одного пункта может остановить рассмотрение.", null, null, "Requested documents — the exact proofs they need, such as payslips, employer confirmations, passport pages, entry records, or bank statements.", "Требуемые документы — точные подтверждения, которые нужны: расчётные листы, справки работодателя, страницы паспорта, записи о въезде или банковские выписки.", null, "מסמכים נדרשים", 4, 2, 1 },
                    { 18, "Use the submission method named on the notice and keep the confirmation number or screenshot.", "Используйте способ подачи, указанный в письме, и сохраните номер подтверждения или снимок экрана.", null, null, "How to submit — tells you whether to upload in the personal area, email the branch, fax, or appear in person. Each channel may need the case number on every page.", "Как подать — сообщает, нужно ли загрузить документы в личный кабинет, отправить по электронной почте, факсу или принести лично. Для каждого канала может требоваться номер дела на каждой странице.", null, "אופן ההגשה", 4, 3, 1 },
                    { 19, "If you cannot gather everything in time, contact the branch before the deadline and ask for an extension.", "Если не успеваете собрать всё вовремя, свяжитесь с отделением до истечения срока и попросите продление.", null, "Submit by the date shown on the notice", "Document deadline — the date by which the branch expects the files. Missing it can freeze the case or lead to a decision without the evidence you wanted considered.", "Крайний срок подачи документов — дата, к которой отделение ждёт файлы. Пропуск срока может заморозить дело или привести к решению без учёта ваших доказательств.", null, "מועד אחרון להמצאת מסמכים", 4, 4, 2 },
                    { 20, null, null, null, null, "What happens next — explains whether payment, eligibility review, or case reopening will continue after the documents arrive.", "Что будет дальше — объясняет, продолжится ли выплата, проверка права или повторное открытие дела после получения документов.", null, "המשך טיפול בבקשה", 4, 5, 0 },
                    { 21, null, null, null, null, "Tax year and case number — identifies which filing period or review the request belongs to. Keep both numbers in front of you before you respond.", "Налоговый год и номер дела — показывают, к какому периоду отчётности или проверке относится запрос. Держите оба номера под рукой перед ответом.", null, "שנת המס / מספר תיק", 5, 1, 0 },
                    { 22, "Prepare clear copies of every document listed; incomplete submissions often trigger another demand.", "Подготовьте чёткие копии каждого указанного документа; неполная подача часто вызывает повторное требование.", null, null, "Requested proofs — commonly Form 106, payslips, invoicing records, pension statements, or bank confirmations that support the declared income.", "Требуемые подтверждения — обычно это форма 106, расчётные листы, счета, пенсионные выписки или банковские подтверждения, подтверждающие заявленный доход.", null, "מסמכים נדרשים", 5, 2, 1 },
                    { 23, "Write down your explanation before you respond so the documents and your written note tell the same story.", "Заранее запишите своё объяснение, чтобы документы и письменное пояснение не противоречили друг другу.", null, null, "Reporting discrepancy — this section usually hints at the mismatch they noticed, such as income reported by an employer that does not match your return.", "Расхождение в отчётности — этот раздел обычно указывает, какое несоответствие они заметили, например доход, сообщённый работодателем, не совпадает с вашей декларацией.", null, "פער בדיווח", 5, 3, 1 },
                    { 24, "Respond before the deadline even if you only have part of the file; attach a note explaining what is still coming.", "Ответьте до истечения срока даже если у вас пока только часть документов; приложите записку с пояснением, что ещё будет дослано.", null, "By the date printed on the letter", "Response deadline — the date by which the Tax Authority expects the documents or explanation. Missing it can delay a refund or cause the assessment to stand as-is.", "Крайний срок ответа — дата, к которой Налоговое управление ожидает документы или объяснение. Пропуск срока может задержать возврат или привести к сохранению текущего расчёта.", null, "מועד למענה", 5, 4, 2 },
                    { 25, "Send the material through the exact channel listed and keep the submission confirmation.", "Отправьте материалы именно через указанный канал и сохраните подтверждение подачи.", null, null, "Submission channel — may direct you to the personal tax portal, secure email, or the local assessing office. The notice sometimes names a specific clerk or office code.", "Канал подачи — может направлять вас в личный налоговый кабинет, защищённую почту или местное отделение. В письме иногда указывается конкретный сотрудник или код офиса.", null, "אופן ההגשה", 5, 5, 1 },
                    { 26, null, null, null, null, "Tax year — tells you which year the refund calculation applies to. Make sure it matches the period you expected to review.", "Налоговый год — показывает, к какому году относится расчёт возврата. Убедитесь, что он совпадает с периодом, который вы ожидали.", null, "שנת המס", 6, 1, 0 },
                    { 27, null, null, null, null, "Refund amount — the sum the Tax Authority believes should be returned to you after offsets, credits, and prior payments are taken into account.", "Сумма возврата — сумма, которую Налоговое управление считает подлежащей возврату после зачёта вычетов, льгот и предыдущих платежей.", null, "סכום ההחזר", 6, 2, 0 },
                    { 28, "Check the account number carefully and update it immediately if it is outdated.", "Тщательно проверьте номер счёта и немедленно обновите его, если он устарел.", null, null, "Bank account details — shows where the refund will be sent. If the account is closed or belongs to the wrong person, the transfer can bounce or be held.", "Банковские реквизиты — показывают, куда будет отправлен возврат. Если счёт закрыт или принадлежит другому человеку, перевод может быть отклонён или задержан.", null, "פרטי חשבון בנק", 6, 3, 1 },
                    { 29, null, null, null, "The transfer is usually made by the date or processing window shown", "Transfer timing — gives the expected payment window or the next processing date. Refunds can take longer if identity or banking details still need validation.", "Срок перевода — указывает ожидаемое окно выплаты или следующую дату обработки. Возврат может занять больше времени, если ещё нужно подтвердить личность или банковские данные.", null, "מועד ההעברה", 6, 4, 0 },
                    { 30, "Contact the office if the refund is missing after the stated window and keep the letter number ready.", "Свяжитесь с отделением, если возврат не поступил после указанного срока, и держите номер письма под рукой.", null, null, "Inquiry or correction — explains how to contact the office if the amount looks wrong, the bank details have changed, or the refund has not arrived.", "Уточнение или исправление — объясняет, как связаться с отделением, если сумма кажется неверной, банковские реквизиты изменились или возврат не поступил.", null, "בירור או תיקון", 6, 5, 1 },
                    { 31, null, null, null, "Renew before the date shown on the notice", "Renewal timing — tells you when your current ID expires or when the authority expects you to renew it. Do not leave it to the last week if you need the document for travel or banking.", "Срок продления — показывает, когда истекает ваше текущее удостоверение личности или когда ведомство ожидает его продления. Не откладывайте на последнюю неделю, если документ нужен для поездок или банка.", null, "מועד לחידוש", 7, 1, 1 },
                    { 32, "Flag any spelling or address error before the appointment so you know what supporting proof to bring.", "Заранее отметьте любую ошибку в написании или адресе, чтобы знать, какие подтверждения взять на приём.", null, null, "Personal details — check your Hebrew and English names, ID number, and current address. Errors here can carry forward into the renewed document.", "Личные данные — проверьте имя на иврите и английском, номер удостоверения и текущий адрес. Ошибки здесь могут перейти в новый документ.", null, "פרטים אישיים", 7, 2, 1 },
                    { 33, "Prepare the originals, not only copies, unless the notice explicitly says uploaded scans are enough.", "Подготовьте оригиналы, а не только копии, если в письме прямо не сказано, что достаточно сканов.", null, null, "Documents to bring — usually the current ID card, passport, proof of address if something changed, and any name-change or status documents that apply to you.", "Документы, которые нужно принести — обычно это текущее удостоверение личности, паспорт, подтверждение адреса при изменениях и любые документы о смене имени или статуса, если это относится к вам.", null, "מסמכים להביא", 7, 3, 1 },
                    { 34, "Pay in advance if the notice allows it and keep the receipt with your documents.", "Оплатите заранее, если письмо это позволяет, и держите квитанцию вместе с документами.", null, null, "Fee or payment reference — explains whether a renewal fee is due and how to pay it before or during the appointment.", "Пошлина или реквизиты оплаты — объясняет, нужно ли платить за продление и как это сделать до приёма или во время него.", null, "אגרה / תשלום", 7, 4, 0 },
                    { 35, "Book the appointment as soon as possible if no slot has been assigned yet.", "Запишитесь как можно раньше, если вам ещё не назначили время.", null, "Book or attend by the date shown on the notice", "Appointment and branch details — tells you which bureau to attend and whether you need to book a slot. Biometric renewals usually require an in-person visit.", "Детали записи и отделения — показывают, в какое бюро нужно прийти и требуется ли предварительная запись. Биометрическое продление обычно требует личного визита.", null, "זימון תור / לשכה", 7, 5, 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Glossary",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Glossary",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Glossary",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Glossary",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Glossary",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "Sections",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "Letters",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Letters",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Letters",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Letters",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Letters",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
