/**
 * ============================================================
 * Guild Bid Manager V1.0
 * Menu.gs
 * ============================================================
 */

const APP_NAME = "Bid Manager";

/**
 * Create custom menu.
 */
function onOpen() {

  SpreadsheetApp.getUi()
    .createMenu(APP_NAME)
    .addItem(
      "Generate Bids",
      "generateBids"
    )
    .addItem(
      "Quick Regenerate",
      "quickRegenerate"
    )
    .addSeparator()
    .addItem(
      "Initialize Workbook...",
      "initializeWorkbook"
    )
    .addToUi();

}

/**
 * Full bid generation.
 */
function generateBids() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  ss.toast(
    "Generating bids...",
    APP_NAME
  );

  try {

    const workbook =
      Workbook.read();

    const validation =
      Validator.validate(
        workbook
      );

    if (
      validation &&
      validation.valid === false
    ) {

      SpreadsheetApp
        .getUi()
        .alert(
          "Validation failed.\n\n" +
          validation.message
        );

      return;

    }

    const result =
      Allocation.allocate(
        workbook
      );

    Output.render(
      workbook,
      result
    );

    ss.toast(
      "Bid generation complete.",
      APP_NAME
    );

  } catch (err) {

    SpreadsheetApp
      .getUi()
      .alert(
        "Generation failed.\n\n" +
        err.message
      );

    throw err;

  }

}

/**
 * Quick regenerate.
 *
 * Uses existing workbook data and simply
 * regenerates Allocation and Bid sheets.
 */
function quickRegenerate() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  ss.toast(
    "Regenerating...",
    APP_NAME
  );

  try {

    const workbook =
      Workbook.read();

    const result =
      Allocation.allocate(
        workbook
      );

    Output.render(
      workbook,
      result
    );

    ss.toast(
      "Regeneration complete.",
      APP_NAME
    );

  } catch (err) {

    SpreadsheetApp
      .getUi()
      .alert(
        "Regeneration failed.\n\n" +
        err.message
      );

    throw err;

  }

}

/**
 * Recreate workbook.
 *
 * WARNING:
 * Deletes all existing Guild Bid Manager data.
 */
function initializeWorkbook() {

  const ui =
    SpreadsheetApp.getUi();

  const response =
    ui.alert(

      "Initialize Workbook",

      "WARNING\n\n" +

      "This will DELETE all Guild Bid Manager sheets and recreate them.\n\n" +

      "This action cannot be undone.\n\n" +

      "Continue?",

      ui.ButtonSet.YES_NO

    );

  if (
    response !== ui.Button.YES
  ) {
    return;
  }

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  ss.toast(
    "Initializing workbook...",
    APP_NAME
  );

  try {

    Workbook.initialize();

    ss.toast(
      "Workbook initialized.",
      APP_NAME
    );

    ui.alert(
      "Workbook successfully initialized."
    );

  } catch (err) {

    ui.alert(
      "Initialization failed.\n\n" +
      err.message
    );

    throw err;

  }

}