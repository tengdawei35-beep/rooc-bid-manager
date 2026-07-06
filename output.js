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
      this.prepareSheet();

    this.writeSummary(
      sheet,
      workbook,
      result
    );
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
   * Prepare Allocation sheet.
   */
  prepareSheet() {

    const ss =
      SpreadsheetApp.getActive();

    let sheet =
      ss.getSheetByName(
        "Allocation"
      );

    if (!sheet) {

      sheet =
        ss.insertSheet(
          "Allocation"
        );

    } else {

      sheet.clear();
      sheet.clearFormats();
      sheet.clearNotes();
      sheet.clearDataValidations();

      if (sheet.getFilter()) {
        sheet.getFilter().remove();
      }

      const merges =
        sheet.getMergedRanges();

      merges.forEach(range =>
        range.breakApart()
      );

    }

    return sheet;

  },

/**
 * Resource summary.
 */
writeSummary(
  sheet,
  workbook,
  result
) {

  const rows = [

    [
      "Resource",
      "Total",
      "Allocated",
      "Overflow"
    ]

  ];

  workbook.settings.resources.forEach(resource => {

    let allocated = 0;

    result.allocations.forEach(player => {

      allocated +=
        player.resources[
          resource.name
        ].assigned;

    });

    rows.push([

      resource.name,

      resource.total,

      allocated,

      result.overflow[
        resource.name
      ] || 0

    ]);

  });

  sheet
    .getRange(
      1,
      1,
      rows.length,
      rows[0].length
    )
    .setValues(rows);

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
        6,
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
        7,
        1,
        values.length,
        values[0].length
      )
      .setValues(
        values
      );

  }

});