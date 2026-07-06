/**
 * ============================================================
 * Guild Bid Manager V4
 * Allocation.gs
 *
 * Allocation Pipeline
 *
 * 1. Build Allocation Objects
 * 2. Apply Reserved Allocations
 * 3. Base Allocation
 * 4. Rotation
 * 5. Reserve Allocation
 * 6. Overflow
 *
 * Pure JavaScript only.
 * ============================================================
 */

const Allocator = Object.freeze({

  /**
   * Entry point.
   */
  allocate(workbook) {

    const result = {

      allocations: this.buildAllocations(
        workbook.players,
        workbook.settings.resources
      ),

      overflow: {},

      rotationIndex:
        workbook.settings.rotationIndex

    };

    this.applyReserved(
      result,
      workbook
    );

    workbook.settings.resources.forEach(resource => {

      this.processResource(
        result,
        workbook,
        resource
      );

    });

    return result;

  },

  /**
   * Create allocation objects for every
   * active & eligible player.
   */
  buildAllocations(players, resources) {

    return players

      .filter(player =>
        player.active &&
        player.eligible
      )

      .map(player => {

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

      });

  },

  /**
   * Reserved allocation.
   */
applyReserved(result, workbook) {

  workbook.reserved.forEach(entry => {

    const allocation =
      result.allocations.find(player =>
        player.name === entry.player
      );

    if (!allocation)
      return;

    const slot =
      allocation.resources[
        entry.resource
      ];

    if (!slot)
      return;

    slot.reserved =
      entry.quantity;

    slot.assigned =
      entry.quantity;

  });

},

  /**
   * Process one resource.
   */
  processResource(
    result,
    workbook,
    resource
  ) {

    const context =
      this.buildContext(
        result,
        resource
      );

    this.applyBaseAllocation(
      result,
      context
    );

    result.rotationIndex =
      this.applyRotation(
        result,
        context,
        result.rotationIndex
      );

    this.applyReserveAllocation(
      result,
      context,
      workbook
    );

    this.calculateOverflow(
      result,
      context
    );

  },

  /**
   * Build context.
   */
  /**
 * Build resource context.
 */
buildContext(
  result,
  resource
) {

  let reservedTotal = 0;

  result.allocations.forEach(player => {

    reservedTotal +=
      player.resources[
        resource.name
      ].reserved;

  });

  return {

    resource,

    reservedTotal,

    remaining:
      Math.max(
        0,
        resource.total -
        reservedTotal
      )

  };

},

  /**
   * Base allocation.
   */
/**
 * Base allocation.
 */
applyBaseAllocation(
  result,
  context
) {

  if (context.remaining <= 0)
    return;

  const eligible = result.allocations.filter(player => {

    const slot =
      player.resources[
        context.resource.name
      ];

    return slot.assigned < slot.limit;

  });

  if (eligible.length === 0)
    return;

  const base = Math.floor(
    context.remaining /
    eligible.length
  );

  if (base <= 0)
    return;

  let allocated = 0;

  eligible.forEach(player => {

    const slot =
      player.resources[
        context.resource.name
      ];

    const capacity =
      slot.limit -
      slot.assigned;

    const grant =
      Math.min(
        base,
        capacity
      );

    slot.assigned += grant;

    allocated += grant;

  });

  context.remaining -= allocated;

},

  /**
   * Rotation.
   */
/**
 * Apply rotation allocation.
 */
applyRotation(
  result,
  context,
  rotationIndex
) {

  if (context.remaining <= 0)
    return rotationIndex;

  let eligible = result.allocations.filter(player => {

    const slot =
      player.resources[
        context.resource.name
      ];

    return slot.assigned < slot.limit;

  });

  if (eligible.length === 0)
    return rotationIndex;

  let index =
    rotationIndex %
    eligible.length;

  while (
    context.remaining > 0 &&
    eligible.length > 0
  ) {

    const player =
      eligible[index];

    const slot =
      player.resources[
        context.resource.name
      ];

    if (slot.assigned < slot.limit) {

      slot.assigned++;

      context.remaining--;

    }

    // Recalculate eligible players
    eligible = result.allocations.filter(player => {

      const slot =
        player.resources[
          context.resource.name
        ];

      return slot.assigned < slot.limit;

    });

    if (eligible.length === 0)
      break;

    index++;

    if (index >= eligible.length)
      index = 0;

  }

  return index;

},

 /**
 * Apply reserve allocation.
 *
 * Remaining resources are distributed fairly
 * among players listed in the Reserved Allocation
 * sheet for this resource.
 *
 * Limits are ignored during this phase.
 */
applyReserveAllocation(
  result,
  context,
  workbook
) {

  if (context.remaining <= 0)
    return;

  // Players participating in reserve pool
  const participants =
    workbook.reserved

      .filter(entry =>
        entry.resource === context.resource.name
      )

      .map(entry => {

        const allocation =
          result.allocations.find(player =>
            player.name === entry.player
          );

        return allocation;

      })

      .filter(allocation => allocation);

  if (participants.length === 0)
    return;

  let index = 0;

  while (context.remaining > 0) {

    const player =
      participants[index];

    player.resources[
      context.resource.name
    ].assigned++;

    context.remaining--;

    index++;

    if (index >= participants.length) {
      index = 0;
    }

  }

},

  /**
   * Overflow.
   */
  calculateOverflow(
    result,
    context
  ) {

    result.overflow[
      context.resource.name
    ] = context.remaining;

  }

});