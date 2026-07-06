/**
 * ============================================================
 * Guild Bid Manager V4
 * Allocation.gs
 *
 * Stage 1
 * Allocation Engine Foundation
 *
 * NO SpreadsheetApp calls.
 * Pure JavaScript only.
 * ============================================================
 */

const Allocator = Object.freeze({

  /**
   * Main entry point.
   *
   * @param {Object} workbook
   * @returns {Object}
   */
  allocate(workbook) {

    const result = {

      allocations: [],

      overflow: {},

      rotationIndex:
        workbook.settings.rotationIndex

    };

    const players =
      this.getEligiblePlayers(
        workbook.players
      );

    // Build allocation objects

    result.allocations =
      players.map(player =>
        this.createAllocation(
          player,
          workbook.settings.resources
        )
      );

    // Reserved allocations

    workbook.settings.resources.forEach(resource => {

      this.applyReserved(
        result.allocations,
        workbook.reserved,
        resource
      );

    });

    return result;

  },

  /**
   * Eligible players only.
   */
  getEligiblePlayers(players) {

    return players.filter(player =>

      player.active &&
      player.eligible

    );

  },

  /**
   * Create one allocation object.
   */
  createAllocation(player, resources) {

    const allocation = {

      id: player.id,

      name: player.name,

      priority: player.priority,

      remarks: player.remarks,

      resources: {}

    };

    resources.forEach(resource => {

      allocation.resources[
        resource.name
      ] = {

        assigned: 0,

        reserved: 0,

        limit: resource.limit,

        type: resource.type

      };

    });

    return allocation;

  },

  /**
   * Apply reserved allocations.
   */
  applyReserved(
    allocations,
    reserved,
    resource
  ) {

    reserved
      .filter(r =>
        r.resource === resource.name
      )
      .forEach(entry => {

        const allocation =
          allocations.find(a =>
            a.name === entry.player
          );

        if (!allocation)
          return;

        allocation.resources[
          resource.name
        ].reserved =
          entry.quantity;

        allocation.resources[
          resource.name
        ].assigned =
          entry.quantity;

      });

  }

});