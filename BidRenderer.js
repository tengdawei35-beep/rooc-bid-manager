/**
 * ============================================================
 * Guild Bid Manager V4
 * BidRenderer.gs
 * ============================================================
 */

const BidRenderer = {

  // ==========================================================
  // Layout Constants
  // ==========================================================

  CARD_WIDTH: 5,
  CARD_HEIGHT: 5,

  SLOT_WIDTH: 45,
  PLAYER_WIDTH: 110,

  PAGE_GAP: 1,
  ROW_GAP: 1,

  FEATHER_CARDS_PER_ROW: 3,
  CARD_CARDS_PER_ROW: 2,

  // ==========================================================
  // Entry Point
  // ==========================================================

  render(
    workbook,
    auctionPlan
  ) {

    const sheet =
      this.prepareSheet();

    //
    // Feathers
    //

    const cardStartColumn =
      this.renderSection(
        sheet,
        "FEATHER",
        auctionPlan.feathers,
        1,
        1,
        this.FEATHER_CARDS_PER_ROW
      );

    //
    // Cards
    //

    this.renderSection(
      sheet,
      "CARD",
      auctionPlan.cards,
      1,
      cardStartColumn + 3,
      this.CARD_CARDS_PER_ROW
    );

    //
    // Final formatting
    //

    this.formatSheet(
      sheet
    );

  },

  // ==========================================================
  // Prepare Bid Sheet
  // ==========================================================

  prepareSheet() {

    const ss =
      SpreadsheetApp.getActiveSpreadsheet();

    let sheet =
      ss.getSheetByName("Bid");

    if (!sheet) {

      sheet =
        ss.insertSheet("Bid");

    } else {

      sheet.clear();

      const filter =
        sheet.getFilter();

      if (filter) {
        filter.remove();
      }

      const merged =
        sheet.getRange(
          1,
          1,
          sheet.getMaxRows(),
          sheet.getMaxColumns()
        ).getMergedRanges();

      merged.forEach(range => range.breakApart());

    }

    sheet.setHiddenGridlines(true);

    sheet.setFrozenRows(1);

    return sheet;

  },

  // ==========================================================
  // Render One Section
  // ==========================================================

  renderSection(
    sheet,
    category,
    entries,
    startRow,
    startColumn,
    cardsPerRow
  ) {

    //
    // Section Title
    //

    const sectionWidth =
      cardsPerRow *
      this.CARD_WIDTH +
      (cardsPerRow - 1) *
      this.PAGE_GAP;

    sheet
      .getRange(
        startRow,
        startColumn,
        1,
        sectionWidth
      )
      .merge()
      .setValue(category + "S")
      .setFontSize(16)
      .setFontWeight("bold")
      .setHorizontalAlignment("center");

    //
    // Group auction entries by page
    //

    const pageMap =
      new Map();

    entries.forEach(entry => {

      if (!pageMap.has(entry.page)) {

        pageMap.set(
          entry.page,
          []
        );

      }

      pageMap
        .get(entry.page)
        .push(entry);

    });

    const pages =
      [...pageMap.keys()]
        .sort((a, b) => a - b);

    //
    // Draw page cards
    //

    pages.forEach((page, index) => {

      const cardRow =

        startRow +

        2 +

        Math.floor(
          index /
          cardsPerRow
        ) *

        (this.CARD_HEIGHT + this.ROW_GAP);

      const cardColumn =

        startColumn +

        (index %
          cardsPerRow) *

        (this.CARD_WIDTH + this.PAGE_GAP);

      this.drawCard(

        sheet,

        category,

        page,

        pageMap.get(page),

        cardRow,

        cardColumn

      );

    });

    //
    // Return last occupied column
    //

    return (

      startColumn +

      sectionWidth - 1

    );

  },

    // ==========================================================
  // Draw One Page Card
  // ==========================================================

  drawCard(
    sheet,
    category,
    page,
    entries,
    startRow,
    startColumn
  ) {

    //
    // PAGE HEADER
    //

    const header =
      sheet.getRange(
        startRow,
        startColumn,
        1,
        this.CARD_WIDTH
      );

    header
      .merge()
      .setValue("PAGE " + page)
      .setFontWeight("bold")
      .setFontColor("white")
      .setBackground("#666666")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");

    //
    // BODY
    //

    for (let i = 0; i < 4; i++) {

      const row =
        startRow + 1 + i;

      const entry =
        entries[i];

      //
      // Slot
      //

      sheet
        .getRange(
          row,
          startColumn
        )
        .setValue("S" + (i + 1))
        .setFontWeight("bold")
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle");

      //
      // Player
      //

      const playerCell =
        sheet.getRange(
          row,
          startColumn + 1,
          1,
          this.CARD_WIDTH - 1
        );

      playerCell.merge();

      playerCell
        .setValue(
          entry
            ? entry.allocation.name
            : ""
        )
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle");

    }

    //
    // OUTER BORDER
    //

    sheet
      .getRange(
        startRow,
        startColumn,
        this.CARD_HEIGHT,
        this.CARD_WIDTH
      )
      .setBorder(
        true,
        true,
        true,
        true,
        true,
        true,
        "#999999",
        SpreadsheetApp.BorderStyle.SOLID_THIN
      );

    //
    // Header Divider
    //

    sheet
      .getRange(
        startRow,
        startColumn,
        1,
        this.CARD_WIDTH
      )
      .setBorder(
        null,
        null,
        true,
        null,
        null,
        null,
        "#666666",
        SpreadsheetApp.BorderStyle.SOLID_MEDIUM
      );

  },

  // ==========================================================
  // Final Formatting
  // ==========================================================

  formatSheet(
    sheet
  ) {

    const lastRow =
      sheet.getLastRow();

    const lastColumn =
      sheet.getLastColumn();

    //
    // Ensure enough columns exist
    //

    const requiredColumns =

      this.FEATHER_CARDS_PER_ROW *

      (this.CARD_WIDTH + this.PAGE_GAP)

      +

      3

      +

      this.CARD_CARDS_PER_ROW *

      (this.CARD_WIDTH + this.PAGE_GAP);

    if (sheet.getMaxColumns() < requiredColumns) {

      sheet.insertColumnsAfter(
        sheet.getMaxColumns(),
        requiredColumns - sheet.getMaxColumns()
      );

    }

    if (
      lastRow === 0 ||
      lastColumn === 0
    ) {
      return;
    }

    //
    // Global Font
    //

    sheet
      .getRange(
        1,
        1,
        lastRow,
        lastColumn
      )
      .setFontFamily("Arial")
      .setFontSize(10)
      .setVerticalAlignment("middle");

    //
    // Feather Columns
    //

    for (
      let i = 0;
      i < this.FEATHER_CARDS_PER_ROW;
      i++
    ) {

      const start =

        1 +

        i *

        (this.CARD_WIDTH + this.PAGE_GAP);

      //
      // Slot
      //

      sheet.setColumnWidth(
        start,
        this.SLOT_WIDTH
      );

      //
      // Player Area
      //

      sheet.setColumnWidth(
        start + 1,
        this.PLAYER_WIDTH
      );

      sheet.setColumnWidth(
        start + 2,
        2
      );

      sheet.setColumnWidth(
        start + 3,
        2
      );

      sheet.setColumnWidth(
        start + 4,
        2
      );

    }

    //
    // Cards Section
    //

    const cardStart =

      1 +

      this.FEATHER_CARDS_PER_ROW *

      (this.CARD_WIDTH + this.PAGE_GAP)

      + 2;

    for (
      let i = 0;
      i < this.CARD_CARDS_PER_ROW;
      i++
    ) {

      const start =

        cardStart +

        i *

        (this.CARD_WIDTH + this.PAGE_GAP);

      sheet.setColumnWidth(
        start,
        this.SLOT_WIDTH
      );

      sheet.setColumnWidth(
        start + 1,
        this.PLAYER_WIDTH
      );

      sheet.setColumnWidth(
        start + 2,
        2
      );

      sheet.setColumnWidth(
        start + 3,
        2
      );

      sheet.setColumnWidth(
        start + 4,
        2
      );

    }

    //
    // Row Heights
    //

    for (
      let r = 1;
      r <= lastRow;
      r++
    ) {

      sheet.setRowHeight(
        r,
        24
      );

    }

    //
    // Freeze
    //

    sheet.setFrozenRows(1);

  }

};