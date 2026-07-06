/**
 * ============================================================
 * Guild Bid Manager V4
 * AuctionPlanner.gs
 *
 * Converts allocation results into auction pages.
 *
 * No SpreadsheetApp calls.
 * Pure JavaScript.
 * ============================================================
 */

const AuctionPlanner = Object.freeze({

  /**
   * Build complete auction plan.
   */
  buildPlan(
    workbook,
    result
  ) {

    const featherSlots =
      this.expandCategory(
        workbook,
        result,
        "Feather"
      );

    const cardSlots =
      this.expandCategory(
        workbook,
        result,
        "Card"
      );

    return {

      feathers:
        this.buildEntries(
          featherSlots,
          workbook.settings.itemsPerPage
        ),

      cards:
        this.buildEntries(
          cardSlots,
          workbook.settings.itemsPerPage
        )

    };

  },

    /**
   * Expand one category into individual auction slots.
   *
   * One assigned item becomes one slot.
   */
  expandCategory(
    workbook,
    result,
    category
  ) {

    const slots = [];

    workbook.settings.resources.forEach(resource => {

      if (resource.type !== category)
        return;

      result.allocations.forEach(allocation => {

        const assigned =
          allocation.resources[
            resource.name
          ].assigned;

        for (
          let i = 0;
          i < assigned;
          i++
        ) {

          slots.push({

            category,

            resource,

            allocation

          });

        }

      });

    });

    return slots;

  },

/**
 * Convert auction slots into bid entries.
 */
buildEntries(
  slots,
  itemsPerPage
) {

  const entries = [];

  slots.forEach((slot, index) => {

    entries.push({

      page:
        Math.floor(
          index / itemsPerPage
        ) + 1,

      slot:
        (index % itemsPerPage) + 1,

      resource:
        slot.resource,

      allocation:
        slot.allocation

    });

  });

  return entries;

},

});