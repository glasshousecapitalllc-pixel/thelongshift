/* The Long Shift — site configuration.
 *
 * This is the only file you should need to edit to open a stream or add a meet-up.
 * Streams live in one WhatsApp Community, one group per room and stage. Paste each group's
 * invite link (it starts https://chat.whatsapp.com/) against the room and stage. Leave a link
 * as null and the page shows an honest "not open yet" with a way to ask for it.
 * Setup, names and the rules to paste are in community/whatsapp-setup.md.
 */
window.LONGSHIFT_CONFIG = {
  siteName: "The Long Shift",

  // Where "ask to open this stream" requests go. A mailto works until there is a form.
  contact: "mailto:hello@example.com?subject=Open%20a%20stream",

  // Life stages. The order here is the order on the switcher.
  stages: [
    { id: "first",     label: "Expecting and first year", sub: "No sleep, new sums" },
    { id: "primary",   label: "Toddlers to primary",      sub: "School runs, nursery bills" },
    { id: "teen",      label: "Teenagers",                sub: "Doors slamming" },
    { id: "separated", label: "Separated",                sub: "Every other weekend" }
  ],

  // Rooms. The order here is the order of the doors.
  rooms: [
    { id: "money", label: "Money", what: "Maintenance, bills, debt, what you're owed", href: "money.html" },
    { id: "work",  label: "Work",  what: "Hours, leave, bosses, redundancy, side income", href: "work.html" },
    { id: "fixer", label: "Fixer", what: "The house, the boiler, the trades", href: "fixer.html" },
    { id: "room",  label: "Chat", what: "Something on your mind. Let's hear it.", href: "room.html" }
  ],

  // streams[room][stage] = { url, label, who }
  // url: the invite link, or null if not open yet.
  // who: one line about who is in it, e.g. "38 men, Leeds and West Yorkshire".
  streams: {
    money: {
      first:     { url: null, label: "Money, first year", who: null },
      primary:   { url: null, label: "Money, toddlers to primary", who: null },
      teen:      { url: null, label: "Money, teenagers", who: null },
      separated: { url: null, label: "Money, separated dads", who: null }
    },
    work: {
      first:     { url: null, label: "Work, first year", who: null },
      primary:   { url: null, label: "Work, toddlers to primary", who: null },
      teen:      { url: null, label: "Work, teenagers", who: null },
      separated: { url: null, label: "Work, separated dads", who: null }
    },
    fixer: {
      first:     { url: null, label: "Fixer, first year", who: null },
      primary:   { url: null, label: "Fixer, toddlers to primary", who: null },
      teen:      { url: null, label: "Fixer, teenagers", who: null },
      separated: { url: null, label: "Fixer, separated dads", who: null }
    },
    room: {
      first:     { url: null, label: "Chat, first year", who: null },
      primary:   { url: null, label: "Chat, toddlers to primary", who: null },
      teen:      { url: null, label: "Chat, teenagers", who: null },
      separated: { url: null, label: "Chat, separated dads", who: null }
    }
  },

  // Real-world meet-ups. Add one per line. Shown on the Chat page.
  meetups: [
    // { town: "Halifax", when: "Mondays 7pm", where: "The Hub, Market Street", note: "Bring a mate", url: null }
  ]
};
