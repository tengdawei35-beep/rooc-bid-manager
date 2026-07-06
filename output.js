/**
 * ============================================================
 * Guild Bid Manager V4
 * Output.gs
 *
 * Responsible only for rendering.
 * No allocation logic belongs here.
 * ============================================================
 */

const Output = Object.freeze({

  /**
   * Entry point.
   */
  render(workbook, result) {

    const sheet =
      this.createAllocationSheet();

    this.writeHeader(
      sheet,
      workbook.settings.resources
    );

    this.writeRows(
      sheet,
      workbook.settings.resources,
      result.allocations
    );

    sheet.autoResizeColumns(
      1,
      workbook.settings.resources.length + 1
    );

  },

  /**
   * Create Allocation sheet.
   */
  createAllocationSheet() {

    const ss =
      SpreadsheetApp.getActive();

    const existing =
      ss.getSheetByName(
        "Allocation"
      );

    if (existing) {

      ss.deleteSheet(
        existing
      );

    }

    return ss.insertSheet(
      "Allocation"
    );

  },

  /**
   * Header row.
   */
  writeHeader(
    sheet,
    resources
  ) {

    const header = [

      "Player"

    ];

    resources.forEach(resource => {

      header.push(
        resource.name
      );

    });

    sheet
      .getRange(
        1,
        1,
        1,
        header.length
      )
      .setValues([
        header
      ]);

  },

  /**
   * Allocation rows.
   */
  writeRows(
    sheet,
    resources,
    allocations
  ) {

    const values = [];

    allocations.forEach(player => {

      const row = [

        player.name

      ];

      resources.forEach(resource => {

        row.push(

          player.resources[
            resource.name
          ].assigned

        );

      });

      values.push(
        row
      );

    });

    if (values.length === 0)
      return;

    sheet
      .getRange(
        2,
        1,
        values.length,
        values[0].length
      )
      .setValues(
        values
      );

  }

});