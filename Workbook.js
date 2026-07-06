/**
 * ============================================================
 * Guild Bid Manager V4
 * Workbook.gs
 *
 * Spreadsheet Read / Write Layer
 * Part 1 - Reading
 * ============================================================
 */

const Workbook = Object.freeze({

  /**
   * Read entire workbook.
   */
  read() {

    return {

      settings: this.readSettings(),

      players: this.readPlayers(),

      reserved: this.readReserved()

    };

  },

  /**
   * Read Settings sheet.
   */
  readSettings() {

    const sheet =
      Utils.getSheet(CONFIG.SHEETS.SETTINGS);

    const values =
      sheet.getDataRange().getValues();

    const resources = [];

    let itemsPerPage =
      CONFIG.ITEMS_PER_PAGE_DEFAULT;

    let rotateExtras =
      CONFIG.ROTATE_EXTRAS_DEFAULT;

    let rotationIndex = 0;

    // Resources

    for (let i = 1; i < values.length; i++) {

      const row = values[i];

      if (Utils.isBlank(row[0]))
        break;

      resources.push({

        name: row[0],

        type: row[1],

        total: Utils.int(row[2]),

        limit: Utils.int(row[3])

      });

    }

    // General Settings

    values.forEach(row => {

      switch (row[0]) {

        case "Items Per Page":

          itemsPerPage =
            Utils.int(row[1]);

          break;

        case "Rotate Extras":

          rotateExtras =
            row[1] === true;

          break;

        case "Rotation Index":

          rotationIndex =
            Utils.int(row[1]);

          break;

      }

    });

    return {

      resources,

      itemsPerPage,

      rotateExtras,

      rotationIndex

    };

  },

  /**
   * Read Players sheet.
   */
  readPlayers() {

    const sheet =
      Utils.getSheet(CONFIG.SHEETS.PLAYERS);

    const values =
      sheet.getDataRange().getValues();

    const players = [];

    let id = 1;

    for (let i = 1; i < values.length; i++) {

      const row = values[i];

      if (Utils.isBlank(row[0]))
        continue;

      players.push({

        id,

        name: row[0],

        active: row[1] === true,

        eligible: row[2] === true,

        priority: row[3],

        remarks: row[4]

      });

      id++;

    }

    return players;

  },

  /**
   * Read Reserved Allocations.
   */
  readReserved() {

    const sheet =
      Utils.getSheet(CONFIG.SHEETS.RESERVED);

    const values =
      sheet.getDataRange().getValues();

    const reserved = [];

    for (let i = 1; i < values.length; i++) {

      const row = values[i];

      if (Utils.isBlank(row[0]))
        continue;

      reserved.push({

        player: row[0],

        resource: row[1],

        quantity: Utils.int(row[2])

      });

    }

    return reserved;

  }

});