/**
 * ============================================================
 * Guild Bid Manager V4
 * Helpers.gs
 * ------------------------------------------------------------
 * Common helper utilities.
 * No business logic.
 * ============================================================
 */

const Utils = Object.freeze({

  /**
   * Deep clone an object.
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Chunk an array into groups.
   */
  chunk(array, size) {

    const result = [];

    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }

    return result;

  },

  /**
   * Build a Map from an array.
   */
  createMap(array, keyField) {

    const map = new Map();

    array.forEach(item => {
      map.set(item[keyField], item);
    });

    return map;

  },

  /**
   * Return timestamp.
   */
  now() {
    return new Date();
  },

  /**
   * Format timestamp.
   */
  formatDate(date) {

    return Utilities.formatDate(
      date,
      Session.getScriptTimeZone(),
      "yyyy-MM-dd HH:mm:ss"
    );

  },

  /**
   * Spreadsheet toast.
   */
  toast(message, title = "Guild Bid Manager") {

    SpreadsheetApp
      .getActive()
      .toast(message, title);

  },

  /**
   * UUID.
   */
  uuid() {

    return Utilities.getUuid();

  },

  /**
   * Hash any object.
   */
  hash(obj) {

    const json =
      JSON.stringify(obj);

    const digest =
      Utilities.computeDigest(
        Utilities.DigestAlgorithm.MD5,
        json
      );

    return digest
      .map(v =>
        ('0' + (v & 0xFF).toString(16)).slice(-2)
      )
      .join('');

  },

  /**
   * Ensure sheet exists.
   */
  getSheet(name) {

    const sheet =
      SpreadsheetApp
        .getActive()
        .getSheetByName(name);

    if (!sheet) {

      throw new Error(
        "Missing sheet: " +
        name
      );

    }

    return sheet;

  },

  /**
   * Auto resize.
   */
  autoResize(sheet) {

    if (sheet.getLastColumn() > 0) {

      sheet.autoResizeColumns(
        1,
        sheet.getLastColumn()
      );

    }

  },

  /**
   * Freeze rows.
   */
  freeze(sheet, rows) {

    sheet.setFrozenRows(rows);

  },

  /**
   * Clear generated data.
   */
  clearSheet(sheet) {

    sheet.clearContents();

  },

  /**
   * Returns true if blank.
   */
  isBlank(value) {

    return (
      value === "" ||
      value === null ||
      value === undefined
    );

  },

  /**
   * Safe integer.
   */
  int(value) {

    return Number(value) || 0;

  }

});