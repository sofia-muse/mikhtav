using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mikhtav.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Slug = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NameHe = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NameEn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NameRu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NameUk = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Issuer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrderIndex = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Glossary",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TermHe = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Transliteration = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MeaningEn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MeaningRu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MeaningUk = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UsageNote = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrderIndex = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Glossary", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Letters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NameHe = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NameEn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NameRu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NameUk = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SummaryEn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SummaryRu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SummaryUk = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrderIndex = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Letters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Letters_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Sections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LetterTypeId = table.Column<int>(type: "int", nullable: false),
                    OrderIndex = table.Column<int>(type: "int", nullable: false),
                    LabelHe = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExplainerEn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExplainerRu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExplainerUk = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ActionRequiredEn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ActionRequiredRu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ActionRequiredUk = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Deadline = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Severity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sections_Letters_LetterTypeId",
                        column: x => x.LetterTypeId,
                        principalTable: "Letters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Issuer", "NameEn", "NameHe", "NameRu", "NameUk", "OrderIndex", "Slug" },
                values: new object[,]
                {
                    { 1, "National Insurance Institute", "National Insurance", "ביטוח לאומי", "Национальное страхование", null, 1, "bituach-leumi" },
                    { 2, "Israel Tax Authority", "Income Tax", "מס הכנסה", "Налоговое управление", null, 2, "mas-hachnasa" }
                });

            migrationBuilder.InsertData(
                table: "Glossary",
                columns: new[] { "Id", "MeaningEn", "MeaningRu", "MeaningUk", "OrderIndex", "TermHe", "Transliteration", "UsageNote" },
                values: new object[,]
                {
                    { 1, "Identity card. The mandatory national ID for residents — its 9-digit number identifies you to every government office.", "Удостоверение личности. Обязательный национальный документ для жителей — его 9-значный номер используется во всех государственных учреждениях.", null, 1, "תעודת זהות", "Te'udat Zehut", null },
                    { 2, "Case/file number. Always quote this number when calling or writing about a specific letter or matter.", "Номер дела/папки. Всегда указывайте этот номер при обращении по конкретному вопросу или письму.", null, 2, "מספר תיק", "Mispar Tik", null },
                    { 3, "National Insurance Institute. Israel's social-security agency, handles pensions, unemployment, maternity, disability and more.", "Битуах Леуми (Институт национального страхования) — израильское ведомство социального обеспечения: пенсии, пособия по безработице, материнству, инвалидности и т.д.", null, 3, "ביטוח לאומי", "Bituach Leumi", null },
                    { 4, "Income Tax (Authority). The Israel Tax Authority — assesses and collects personal and corporate income tax.", "Подоходный налог (управление). Налоговое управление Израиля — рассчитывает и собирает подоходный налог с физических и юридических лиц.", null, 4, "מס הכנסה", "Mas Hachnasa", null },
                    { 5, "Payment demand. An official request to pay an outstanding amount by a stated date.", "Требование об оплате. Официальное требование уплатить указанную сумму до определённой даты.", null, 5, "דרישת תשלום", "Drishat Tashlum", null },
                    { 6, "Final deadline. The last date by which action must be taken without penalty.", "Крайний срок. Последняя дата, до которой можно действовать без штрафа.", null, 6, "מועד אחרון", "Moed Acharon", null },
                    { 7, "Appeal / objection. A formal challenge to a decision; most have a strict filing window (often 30 days).", "Возражение / апелляция. Официальное оспаривание решения; обычно действует строгий срок подачи (часто 30 дней).", null, 7, "ערעור", "Erur", "Always submit in writing and keep proof of receipt." },
                    { 8, "Confirmation or approval. A document or letter that confirms a status, eligibility, or completed action.", "Подтверждение или утверждение. Документ или письмо, подтверждающее статус, право или совершённое действие.", null, 8, "אישור", "Ishur", null },
                    { 9, "Explanatory note. The supplementary page attached to a letter that explains the figures or decisions on the main page.", "Пояснительная записка. Дополнительная страница к письму, поясняющая цифры или решения, указанные на основной странице.", null, 9, "הסבר נלווה", "Hesber Nilve", null },
                    { 10, "Clause or section. Refers to a numbered paragraph of a law or document.", "Пункт или раздел. Обозначает пронумерованный пункт закона или документа.", null, 10, "סעיף", "Sa'if", null },
                    { 11, "Validity. The period during which a document, permit, or approval is in force.", "Срок действия. Период, в течение которого документ, разрешение или одобрение действительны.", null, 11, "תוקף", "Tokef", null },
                    { 12, "Exemption. Relief from an obligation — most commonly tax, but also fees or service requirements.", "Льгота / освобождение. Освобождение от обязательства — чаще всего от налога, но также от сборов или иных требований.", null, 12, "פטור", "Ptur", null },
                    { 13, "Enforcement / Bailiff's Office. The civil debt-collection authority. If your case reaches here, your bank account can be frozen and assets seized.", "Исполнительная служба (Хотzаа ла-Поэль). Гражданское ведомство по взысканию долгов. Если дело передано сюда, могут заморозить счёт и арестовать имущество.", null, 13, "הוצאה לפועל", "Hotza'a la-Po'al", "If you receive a letter from here, respond immediately — do not ignore it." },
                    { 14, "Interest. Added to overdue amounts; can also refer to interest you owe or are owed under a law.", "Проценты. Начисляются на просроченные суммы; могут также относиться к процентам, которые вы должны или которые причитаются вам по закону.", null, 14, "ריבית", "Ribit", null },
                    { 15, "Regulation. A binding rule issued under the authority of a law. Often cited by number (e.g. \"Takana 2(a)\").", "Положение / постановление. Обязательное правило, изданное на основании закона. Часто указывается номером (например, «Takana 2(a)»).", null, 15, "תקנה", "Takana", null }
                });

            migrationBuilder.InsertData(
                table: "Letters",
                columns: new[] { "Id", "CategoryId", "NameEn", "NameHe", "NameRu", "NameUk", "OrderIndex", "Slug", "SummaryEn", "SummaryRu", "SummaryUk" },
                values: new object[,]
                {
                    { 1, 1, "National Insurance Enrolment Confirmation", "אישור ביטוח לאומי", "Подтверждение регистрации в Битуах Леуми", null, 1, "ishur-bituach", "Confirms that your national insurance file is active and lists the benefit categories you're enrolled in.", "Подтверждает, что ваше дело в Битуах Леуми активно, и перечисляет категории страхования, к которым вы относитесь.", null },
                    { 2, 2, "Annual Tax Demand Notice", "הודעת דרישה שנתית", "Годовое требование об уплате налога", null, 1, "drisha-shnatit", "An assessment from the Tax Authority of how much you owe (or are owed) for a given tax year, with a payment or appeal deadline.", "Расчёт Налогового управления о сумме, которую вы должны (или которая причитается вам) за налоговый год, с указанным сроком оплаты или подачи возражения.", null }
                });

            migrationBuilder.InsertData(
                table: "Sections",
                columns: new[] { "Id", "ActionRequiredEn", "ActionRequiredRu", "ActionRequiredUk", "Deadline", "ExplainerEn", "ExplainerRu", "ExplainerUk", "LabelHe", "LetterTypeId", "OrderIndex", "Severity" },
                values: new object[,]
                {
                    { 1, "If anything is wrong, contact your local Bituach Leumi branch.", "Если что-то указано неверно, обратитесь в местное отделение Битуах Леуми.", null, null, "Personal details — check your name, ID number (teudat zehut), and address are spelled correctly. Errors here are the most common cause of payments going to the wrong person.", "Личные данные — проверьте, что ваше имя, номер удостоверения (теудат зеут) и адрес указаны верно. Ошибки в этой части — самая частая причина того, что выплаты приходят не тому человеку.", null, "פרטים אישיים", 1, 1, 1 },
                    { 2, null, null, null, null, "Coverage start date — the date on which your national insurance enrolment becomes active. Some benefits (maternity, work injury) only apply after a qualifying period that starts from this date.", "Дата начала страхования — день, с которого ваше национальное страхование вступает в силу. Некоторые виды пособий (по беременности, в связи с травмой на работе) применяются только после определённого периода с этой даты.", null, "תאריך תחילת הביטוח", 1, 2, 0 },
                    { 3, null, null, null, null, "Insurance categories — the benefit programs you're enrolled in (e.g. old age, disability, maternity, unemployment, work injury). Each category has its own eligibility rules.", "Категории страхования — программы пособий, к которым вы относитесь (например, по старости, инвалидности, материнству, безработице, травмам на работе). У каждой категории — свои условия.", null, "קטגוריות הביטוח", 1, 3, 0 },
                    { 4, "If you're self-employed, set up a standing order so payments aren't missed — late contributions can interrupt benefit eligibility.", "Если вы самозанятый, оформите автоматический платёж, чтобы не пропускать взносы — просрочки могут привести к потере права на пособия.", null, "Monthly, on the date shown", "Monthly contribution — the amount you pay (or that's deducted from your salary) each month. Self-employed or unemployed people pay directly; salaried employees usually have it withheld by the employer.", "Месячный взнос — сумма, которую вы платите (или которая удерживается из зарплаты) каждый месяц. Самозанятые и безработные платят напрямую; у наёмных работников взнос обычно удерживает работодатель.", null, "סכום החיוב החודשי", 1, 4, 1 },
                    { 5, null, null, null, null, "Contact details — phone number and address of your assigned branch. Use the case number (mispar tik) shown on the letter whenever you contact them.", "Контактные данные — телефон и адрес вашего отделения. При обращении всегда указывайте номер дела (миспар тик), указанный в письме.", null, "פרטי יצירת קשר", 1, 5, 0 },
                    { 6, null, null, null, null, "Tax year — the calendar year this demand relates to. In Israel the tax year matches the calendar year (January through December).", "Налоговый год — календарный год, к которому относится требование. В Израиле налоговый год совпадает с календарным (январь — декабрь).", null, "שנת המס", 2, 1, 0 },
                    { 7, "Compare this figure against your own records. If it's wrong, you can dispute the demand within 30 days.", "Сверьте сумму со своими записями. Если она неверна, вы можете подать возражение в течение 30 дней.", null, null, "Reported income — the income figure on which the tax was calculated. This is based on your or your employer's filings (Form 106 from your employer is the most common source).", "Заявленный доход — сумма дохода, по которой рассчитан налог. Берётся из ваших деклараций или деклараций работодателя (чаще всего из формы 106).", null, "הכנסה מדווחת", 2, 2, 1 },
                    { 8, null, null, null, null, "Amount owed — the total tax due, often including penalties and interest (ribit) on any underpayment. A negative amount means you're owed a refund.", "Сумма задолженности — общий налог к уплате, обычно с пенями и процентами (рибит) за недоплату. Отрицательная сумма означает, что вам должны возврат.", null, "סכום החוב", 2, 3, 2 },
                    { 9, "Pay via Bank HaPoalim / online banking / the Tax Authority website. Keep proof of payment.", "Оплата возможна через Банк ха-Поалим / онлайн-банк / сайт Налогового управления. Сохраните подтверждение оплаты.", null, "Date shown on the notice (typically 30 days)", "Payment deadline — pay by this date to avoid additional interest charges and to keep the case out of enforcement (hotza'a la-po'al).", "Крайний срок оплаты — заплатите до этой даты, чтобы избежать новых процентов и не попасть в исполнительное производство (hотzаа ла-поэль).", null, "מועד תשלום אחרון", 2, 4, 2 },
                    { 10, "If the amount is large, consider consulting an accountant (ro'eh cheshbon) before submitting the appeal.", "Если сумма значительная, имеет смысл проконсультироваться с бухгалтером (роэ хешбон) перед подачей возражения.", null, "30 days from notice receipt", "How to appeal — if you disagree with the calculation, file a written objection (erur) within 30 days of receiving the notice. State the tax year, case number, and the specific item you're disputing.", "Как подать возражение — если вы не согласны с расчётом, подайте письменное возражение (эрур) в течение 30 дней с момента получения уведомления. Укажите налоговый год, номер дела и оспариваемую позицию.", null, "אופן הגשת ערעור", 2, 5, 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Slug",
                table: "Categories",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Letters_CategoryId",
                table: "Letters",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Letters_Slug",
                table: "Letters",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sections_LetterTypeId",
                table: "Sections",
                column: "LetterTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Glossary");

            migrationBuilder.DropTable(
                name: "Sections");

            migrationBuilder.DropTable(
                name: "Letters");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
