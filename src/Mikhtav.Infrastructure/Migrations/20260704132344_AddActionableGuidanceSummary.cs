using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mikhtav.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddActionableGuidanceSummary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppliesWhenEn",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AppliesWhenRu",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AppliesWhenUk",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NeedsDocuments",
                table: "Letters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryNextStepEn",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PrimaryNextStepRu",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryNextStepUk",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RecommendedChannelEn",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RecommendedChannelRu",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RecommendedChannelUk",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhatToVerifyEn",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhatToVerifyRu",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhatToVerifyUk",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhenToContactAuthorityEn",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhenToContactAuthorityRu",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhenToContactAuthorityUk",
                table: "Letters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Letters",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "AppliesWhenEn", "AppliesWhenRu", "AppliesWhenUk", "NeedsDocuments", "PrimaryNextStepEn", "PrimaryNextStepRu", "PrimaryNextStepUk", "RecommendedChannelEn", "RecommendedChannelRu", "RecommendedChannelUk", "WhatToVerifyEn", "WhatToVerifyRu", "WhatToVerifyUk", "WhenToContactAuthorityEn", "WhenToContactAuthorityRu", "WhenToContactAuthorityUk" },
                values: new object[] { "you've just enrolled in national insurance or need to confirm your coverage became active", null, null, false, "Check that your personal details and coverage start date are correct, then set up any monthly payment the letter expects.", null, null, "Use your Bituach Leumi personal area first, then call the branch if any detail is wrong.", null, null, "Verify the ID number, address, coverage start date, and the insurance categories listed on the notice.", null, null, "your name, ID number, start date, or insurance category is missing or incorrect", null, null });

            migrationBuilder.UpdateData(
                table: "Letters",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "AppliesWhenEn", "AppliesWhenRu", "AppliesWhenUk", "NeedsDocuments", "PrimaryNextStepEn", "PrimaryNextStepRu", "PrimaryNextStepUk", "RecommendedChannelEn", "RecommendedChannelRu", "RecommendedChannelUk", "WhatToVerifyEn", "WhatToVerifyRu", "WhatToVerifyUk", "WhenToContactAuthorityEn", "WhenToContactAuthorityRu", "WhenToContactAuthorityUk" },
                values: new object[] { "the Tax Authority says you owe money or need to respond about a specific tax year", null, null, true, "Compare the reported income and amount due against your own records before you decide whether to pay or appeal.", null, null, "Use the payment or objection channel printed on the notice and keep proof of every submission.", null, null, "Verify the tax year, reported income, total amount due, and the final payment or objection deadline.", null, null, "the income, amount due, or deadline does not match your records", null, null });

            migrationBuilder.UpdateData(
                table: "Letters",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "AppliesWhenEn", "AppliesWhenRu", "AppliesWhenUk", "NeedsDocuments", "PrimaryNextStepEn", "PrimaryNextStepRu", "PrimaryNextStepUk", "RecommendedChannelEn", "RecommendedChannelRu", "RecommendedChannelUk", "WhatToVerifyEn", "WhatToVerifyRu", "WhatToVerifyUk", "WhenToContactAuthorityEn", "WhenToContactAuthorityRu", "WhenToContactAuthorityUk" },
                values: new object[] { "unpaid national insurance contributions or a recalculation created an outstanding balance", null, null, true, "Confirm the reason for the debt, then either pay, ask for instalments, or dispute it in writing right away.", null, null, "Respond through the branch or payment route printed on the notice and keep the receipt or case reference.", null, null, "Verify the charged period, reason for the debt, total amount due, and the last payment date.", null, null, "you already paid, the debt reason is wrong, or you need an instalment plan before the deadline", null, null });

            migrationBuilder.UpdateData(
                table: "Letters",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "AppliesWhenEn", "AppliesWhenRu", "AppliesWhenUk", "NeedsDocuments", "PrimaryNextStepEn", "PrimaryNextStepRu", "PrimaryNextStepUk", "RecommendedChannelEn", "RecommendedChannelRu", "RecommendedChannelUk", "WhatToVerifyEn", "WhatToVerifyRu", "WhatToVerifyUk", "WhenToContactAuthorityEn", "WhenToContactAuthorityRu", "WhenToContactAuthorityUk" },
                values: new object[] { "Bituach Leumi cannot finish a claim or status review until you prove something with documents", null, null, true, "Collect every document listed on the notice and submit them through the named channel before the deadline.", null, null, "Use the exact upload, email, fax, or branch channel listed on the request.", null, null, "Verify which claim this request belongs to, the exact document list, and the submission deadline.", null, null, "you cannot get the documents in time or the request names documents that do not fit your case", null, null });

            migrationBuilder.UpdateData(
                table: "Letters",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "AppliesWhenEn", "AppliesWhenRu", "AppliesWhenUk", "NeedsDocuments", "PrimaryNextStepEn", "PrimaryNextStepRu", "PrimaryNextStepUk", "RecommendedChannelEn", "RecommendedChannelRu", "RecommendedChannelUk", "WhatToVerifyEn", "WhatToVerifyRu", "WhatToVerifyUk", "WhenToContactAuthorityEn", "WhenToContactAuthorityRu", "WhenToContactAuthorityUk" },
                values: new object[] { "the Tax Authority sees a mismatch or needs more proof for income, credits, or a refund review", null, null, true, "Match the request against your tax records, then send the listed proofs and a short explanation before the response deadline.", null, null, "Submit the documents through the tax portal or office channel named on the letter.", null, null, "Verify the tax year, case number, discrepancy described, and the deadline for replying.", null, null, "the request refers to the wrong tax year, wrong taxpayer, or documents you cannot reasonably provide", null, null });

            migrationBuilder.UpdateData(
                table: "Letters",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "AppliesWhenEn", "AppliesWhenRu", "AppliesWhenUk", "NeedsDocuments", "PrimaryNextStepEn", "PrimaryNextStepRu", "PrimaryNextStepUk", "RecommendedChannelEn", "RecommendedChannelRu", "RecommendedChannelUk", "WhatToVerifyEn", "WhatToVerifyRu", "WhatToVerifyUk", "WhenToContactAuthorityEn", "WhenToContactAuthorityRu", "WhenToContactAuthorityUk" },
                values: new object[] { "the Tax Authority says you overpaid and plans to send money back", null, null, false, "Check that the refund amount and bank details are correct, then monitor the payment window before following up.", null, null, "Use the refund inquiry channel printed on the notice if the transfer is delayed or the bank details changed.", null, null, "Verify the tax year, refund amount, receiving bank account, and expected transfer timing.", null, null, "the bank account is outdated, the amount seems wrong, or the refund does not arrive in the stated window", null, null });

            migrationBuilder.UpdateData(
                table: "Letters",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "AppliesWhenEn", "AppliesWhenRu", "AppliesWhenUk", "NeedsDocuments", "PrimaryNextStepEn", "PrimaryNextStepRu", "PrimaryNextStepUk", "RecommendedChannelEn", "RecommendedChannelRu", "RecommendedChannelUk", "WhatToVerifyEn", "WhatToVerifyRu", "WhatToVerifyUk", "WhenToContactAuthorityEn", "WhenToContactAuthorityRu", "WhenToContactAuthorityUk" },
                values: new object[] { "your ID card is expiring or the Interior Ministry is prompting you to renew it", null, null, true, "Book or confirm the appointment, then gather the ID, passport, payment receipt, and any address or name-change documents.", null, null, "Use the booking route or bureau details printed on the notice before arriving in person.", null, null, "Verify the renewal date, bureau, required documents, fee details, and whether a biometric visit is required.", null, null, "you cannot get an appointment, your personal details are wrong, or you need to update status information", null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppliesWhenEn",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "AppliesWhenRu",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "AppliesWhenUk",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "NeedsDocuments",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "PrimaryNextStepEn",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "PrimaryNextStepRu",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "PrimaryNextStepUk",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "RecommendedChannelEn",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "RecommendedChannelRu",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "RecommendedChannelUk",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "WhatToVerifyEn",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "WhatToVerifyRu",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "WhatToVerifyUk",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "WhenToContactAuthorityEn",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "WhenToContactAuthorityRu",
                table: "Letters");

            migrationBuilder.DropColumn(
                name: "WhenToContactAuthorityUk",
                table: "Letters");
        }
    }
}
