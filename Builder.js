/**
 * ============================================================
 * Guild Bid Manager V4
 * Workbook.gs
 *
 * Part 1
 * Workbook Initialization
 * ============================================================
 */

const Builder = Object.freeze({

  initialize() {

    this.ensureSheet(CONFIG.SHEETS.SETTINGS);
    this.ensureSheet(CONFIG.SHEETS.PLAYERS);
    this.ensureSheet(CONFIG.SHEETS.RESERVED);
    this.ensureSheet(CONFIG.SHEETS.ALLOCATION);
    this.ensureSheet(CONFIG.SHEETS.BID_PAGES);
    this.ensureSheet(CONFIG.SHEETS.SYSTEM);

    this.initializeSettings();
    this.initializePlayers();
    this.initializeReserved();
    this.initializeAllocation();
    this.initializeBidPages();
    this.initializeSystem();

    Utils.toast("Workbook initialized.");

  },

  ensureSheet(name) {

    const ss = SpreadsheetApp.getActive();

    let sheet = ss.getSheetByName(name);

    if (!sheet) {

      sheet = ss.insertSheet(name);

    }

    return sheet;

  },

  resetSheet(sheet) {

    sheet.clearContents();
    sheet.clearFormats();
    sheet.clearNotes();

  },

  initializeSettings() {

    const sheet =
      this.ensureSheet(
        CONFIG.SHEETS.SETTINGS
      );

    if (sheet.getLastRow() > 0)
      return;

    const values = [

      ["Resource","Type","Total","Limit"],

      ["Light/Dark","Feather",150,3],

      ["Time/Space","Feather",170,5],

      ["Puppet Fragment","Card",28,1],

      [],

      ["Setting","Value"],

      ["Items Per Page",4],

      ["Rotate Extras",true],

      ["Rotation Index",0]

    ];

    sheet
      .getRange(
        1,
        1,
        values.length,
        4
      )
      .setValues(values);

    Utils.freeze(sheet,1);
    Utils.autoResize(sheet);

  },

  initializePlayers() {

    const sheet =
      this.ensureSheet(
        CONFIG.SHEETS.PLAYERS
      );

    if (sheet.getLastRow() > 0)
      return;

    sheet.appendRow([

      "Player",

      "Active",

      "Eligible",

      "Priority",

      "Remarks"

    ]);

    sheet
      .getRange(
        2,
        2,
        CONFIG.MAX_PLAYERS,
        2
      )
      .insertCheckboxes();

    const rule =
      SpreadsheetApp
      .newDataValidation()
      .requireValueInList(
        CONFIG.PRIORITIES,
        true
      )
      .build();

    sheet
      .getRange(
        2,
        4,
        CONFIG.MAX_PLAYERS
      )
      .setDataValidation(rule);

    Utils.freeze(sheet,1);
    Utils.autoResize(sheet);

  },

  initializeReserved() {

    const sheet =
      this.ensureSheet(
        CONFIG.SHEETS.RESERVED
      );

    if (sheet.getLastRow() > 0)
      return;

    sheet.appendRow([

      "Player",

      "Resource",

      "Quantity"

    ]);

    Utils.freeze(sheet,1);
    Utils.autoResize(sheet);

  },

  initializeAllocation() {

    const sheet =
      this.ensureSheet(
        CONFIG.SHEETS.ALLOCATION
      );

    sheet.clear();

    sheet.appendRow([

      "Player",

      "Status"

    ]);

    Utils.freeze(sheet,1);

  },

  initializeBidPages() {

    const sheet =
      this.ensureSheet(
        CONFIG.SHEETS.BID_PAGES
      );

    sheet.clear();

    sheet.getRange("A1").setValue(
      "Guild Bid Pages"
    );

  },

  initializeSystem() {

    const sheet =
      this.ensureSheet(
        CONFIG.SHEETS.SYSTEM
      );

    sheet.clear();

    sheet.getRange(
      1,
      1,
      4,
      2
    ).setValues([

      ["Key","Value"],

      ["Version",CONFIG.VERSION],

      ["Dirty",true],

      ["Rotation Index",0]

    ]);

    sheet.hideSheet();

  }

});
