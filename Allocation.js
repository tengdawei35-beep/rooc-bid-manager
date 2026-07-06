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
      context
    );

    result.rotationIndex =
      this.applyRotation(
        context,
        result.rotationIndex
      );

    this.applyReserveAllocation(
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
  buildContext(
  result,
  resource
) {

  const context = {

    resource,

    eligible: [],

    reservedTotal: 0,

    remaining: 0

  };

  result.allocations.forEach(player => {

    const slot =
      player.resources[
        resource.name
      ];

    context.reservedTotal +=
      slot.reserved;

    const remainingCapacity =
      Math.max(
        0,
        slot.limit -
        slot.assigned
      );

    if (remainingCapacity > 0) {

      context.eligible.push({

        player,

        slot

      });

    }

  });

  context.remaining =
    Math.max(
      0,
      resource.total -
      context.reservedTotal
    );

  return context;

},

  /**
   * Base allocation.
   */
applyBaseAllocation(
  context
) {

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

  context.eligible.forEach(entry => {

    const remainingCapacity =
      entry.slot.limit -
      entry.slot.assigned;

    const grant = Math.min(
      base,
      remainingCapacity
    );

    entry.slot.assigned += grant;

    allocated += grant;

  });

  context.remaining -= allocated;

},

  /**
   * Rotation.
   */
applyRotation(
  context,
  rotationIndex
) {

  if (context.remaining <= 0)
    return rotationIndex;

  if (context.eligible.length === 0)
    return rotationIndex;

  let index =
    rotationIndex %
    context.eligible.length;

  let exhausted = false;

  while (
    context.remaining > 0 &&
    !exhausted
  ) {

    exhausted = true;

    for (
      let i = 0;
      i < context.eligible.length;
      i++
    ) {

      const current =
        (index + i) %
        context.eligible.length;

      const entry =
        context.eligible[current];

      const slot =
        entry.slot;

      if (
        slot.assigned >= slot.limit
      ) {
        continue;
      }

      slot.assigned++;

      context.remaining--;

      index =
        (current + 1) %
        context.eligible.length;

      exhausted = false;

      if (context.remaining <= 0)
        break;

    }

  }

  return index;

},

  /**
   * Reserve allocation.
   */
  applyReserveAllocation(
    context,
    workbook
  ) {

    // Commit 5

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