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

  result.allocations =
    players.map(player =>
      this.createAllocation(
        player,
        workbook.settings.resources
      )
    );

  // Build fast lookup table

  const allocationMap =
    new Map();

  result.allocations.forEach(a => {

    allocationMap.set(
      a.name,
      a
    );

  });

  // Reserved allocations

  this.applyReserved(
    allocationMap,
    workbook.reserved,
    workbook.settings.resources
  );

  // Process every resource

  workbook.settings.resources.forEach(resource => {

    this.processResource(

      result,

      allocationMap,

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
  allocationMap,
  reserved,
  resources
) {

  reserved.forEach(entry => {

    const allocation =
      allocationMap.get(
        entry.player
      );

    if (!allocation)
      return;

    const resource =
      allocation.resources[
        entry.resource
      ];

    if (!resource)
      return;

    resource.reserved =
      entry.quantity;

    resource.assigned =
      entry.quantity;

  });

},

processResource(
  result,
  allocationMap,
  resource
) {

  const context =
    this.buildResourceContext(
      result,
      resource
    );

  this.applyBaseAllocation(
    context
  );

  result.overflow[
    resource.name
  ] = context.remaining;

},

/**
 * Build allocation context for one resource.
 */
buildResourceContext(
  result,
  resource
) {

  let reservedTotal = 0;

  const eligible = [];

  result.allocations.forEach(player => {

    const slot =
      player.resources[
        resource.name
      ];

    reservedTotal +=
      slot.reserved;

    slot.remainingCapacity =
      Math.max(
        0,
        slot.limit -
        slot.reserved
      );

    if (
      slot.remainingCapacity > 0
    ) {

      eligible.push(player);

    }

  });

  return {

    resource,

    reservedTotal,

    remaining:
      Math.max(
        0,
        resource.total -
        reservedTotal
      ),

    eligible

  };

},

/**
 * Apply fair base allocation (Option A).
 *
 * Everyone receives the same base amount.
 * Leftover resources are handled later by Rotation.
 */
applyBaseAllocation(context) {

  if (context.remaining <= 0)
    return;

  if (context.eligible.length === 0)
    return;

  const base = Math.floor(
    context.remaining /
    context.eligible.length
  );

  if (base <= 0)
    return;

  let allocated = 0;

  context.eligible.forEach(player => {

    const slot =
      player.resources[
        context.resource.name
      ];

    const grant =
      Math.min(
        base,
        slot.remainingCapacity
      );

    slot.assigned += grant;

    slot.remainingCapacity -= grant;

    allocated += grant;

  });

  context.remaining -= allocated;

},

});