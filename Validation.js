/**
 * ============================================================
 * Guild Bid Manager V4
 * Validation.gs
 * ============================================================
 */

const Validator = Object.freeze({

  /**
   * Main validation entry.
   */
  run(workbook) {

    try {

      this.validate(workbook);

      return true;

    } catch (err) {

      throw new Error(
        "Validation Failed\n\n" +
        err.message
      );

    }

  },

  /**
   * Validate everything.
   */
  validate(workbook) {

    this.validateSettings(workbook.settings);

    this.validatePlayers(workbook.players);

    this.validateReserved(
      workbook.players,
      workbook.settings.resources,
      workbook.reserved
    );

  },

  /**
   * Settings
   */
  validateSettings(settings) {

    if (!settings)
      throw new Error("Settings missing.");

    if (!Array.isArray(settings.resources))
      throw new Error("Resources missing.");

    if (settings.resources.length === 0)
      throw new Error("No resources configured.");

    const names = new Set();

    settings.resources.forEach(resource => {

      this.validateResource(resource);

      if (names.has(resource.name)) {

        throw new Error(
          "Duplicate resource: " +
          resource.name
        );

      }

      names.add(resource.name);

    });

  },

  /**
   * Single resource.
   */
  validateResource(resource) {

    if (Utils.isBlank(resource.name))
      throw new Error("Blank resource name.");

    if (
      resource.type !== CONFIG.RESOURCE_TYPES.FEATHER &&
      resource.type !== CONFIG.RESOURCE_TYPES.CARD
    ) {

      throw new Error(
        resource.name +
        " has an invalid type."
      );

    }

    if (resource.total < 0)
      throw new Error(
        resource.name +
        " has a negative total."
      );

    if (resource.limit < 0)
      throw new Error(
        resource.name +
        " has a negative limit."
      );

  },

  /**
   * Players
   */
  validatePlayers(players) {

    const names = new Set();

    players.forEach(player => {

      if (Utils.isBlank(player.name))
        throw new Error(
          "Blank player name."
        );

      if (names.has(player.name))
        throw new Error(
          "Duplicate player: " +
          player.name
        );

      names.add(player.name);

    });

  },

  /**
   * Reserved allocations
   */
  validateReserved(players, resources, reserved) {

    const playerMap = Utils.createMap(
      players,
      "name"
    );

    const resourceMap = Utils.createMap(
      resources,
      "name"
    );

    const seen = new Set();

    reserved.forEach(entry => {

      const key =
        entry.player +
        "|" +
        entry.resource;

      if (seen.has(key))
        throw new Error(
          "Duplicate reserved allocation: " +
          key
        );

      seen.add(key);

      if (!playerMap.has(entry.player))
        throw new Error(
          "Unknown player: " +
          entry.player
        );

      if (!resourceMap.has(entry.resource))
        throw new Error(
          "Unknown resource: " +
          entry.resource
        );

      const player =
        playerMap.get(entry.player);

      if (!player.active)
        throw new Error(
          entry.player +
          " is inactive."
        );

      if (!player.eligible)
        throw new Error(
          entry.player +
          " is not eligible."
        );

      const resource =
        resourceMap.get(entry.resource);

      if (entry.quantity < 0)
        throw new Error(
          "Negative quantity for " +
          entry.player
        );

    });

  }

});