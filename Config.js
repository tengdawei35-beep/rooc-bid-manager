/**
 * ============================================================
 * Guild Bid Manager V4
 * Config.gs
 * ------------------------------------------------------------
 * Global configuration.
 * This file contains NO business logic.
 * ============================================================
 */

const CONFIG = Object.freeze({

  VERSION: "4.0.0",

  MAX_PLAYERS: 80,

  ITEMS_PER_PAGE_DEFAULT: 4,

  ROTATE_EXTRAS_DEFAULT: true,

  RESOURCE_TYPES: Object.freeze({
    FEATHER: "Feather",
    CARD: "Card"
  }),

  PLAYER_STATUS: Object.freeze({
    ELIGIBLE: "Eligible",
    NOT_ELIGIBLE: "Not Eligible",
    INACTIVE: "Inactive"
  }),

  SHEETS: Object.freeze({

    SETTINGS: "Settings",

    PLAYERS: "Players",

    RESERVED: "Reserved Allocations",

    ALLOCATION: "Allocation",

    BID_PAGES: "Bid Pages",

    SYSTEM: "_System"

  }),

  SYSTEM_KEYS: Object.freeze({

    VERSION: "Version",

    DIRTY: "Dirty",

    LAST_GENERATED: "Last Generated",

    ROTATION_INDEX: "Rotation Index"

  }),

  COLORS: Object.freeze({

    HEADER: "#1F4E78",

    HEADER_TEXT: "#FFFFFF",

    FEATHER: "#D9EAD3",

    CARD: "#FFF2CC",

    EMPTY: "#F4CCCC",

    RESERVED: "#CFE2F3",

    SUMMARY: "#D0E0E3",

    SEARCH: "#EAD1DC",

    SUCCESS: "#D9EAD3",

    WARNING: "#FFE599"

  }),

  PRIORITIES: Object.freeze([
    "Leader",
    "Officer",
    "Council",
    "Member"
  ]),

  SETTINGS_LAYOUT: Object.freeze({

    RESOURCE_HEADER_ROW: 2,

    RESOURCE_START_ROW: 3,

    GENERAL_HEADER_ROW: 8,

    GENERAL_START_ROW: 9

  }),

  BID_PAGE: Object.freeze({

    LEFT_START_COLUMN: 1,

    RIGHT_START_COLUMN: 9,

    HEADER_ROW: 3

  })

});