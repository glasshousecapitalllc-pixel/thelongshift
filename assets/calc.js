/* Child maintenance estimate, Child Maintenance Service rules for England, Wales and Scotland.
 *
 * Rates used (the 2012 scheme, unchanged in 2026):
 *   Nil rate       income under £7 a week
 *   Flat rate      £7 a week: income £7 to £100, or paying parent on certain benefits
 *   Reduced rate   income £100.01 to £199.99: £7 plus 17% / 25% / 31% of income over £100
 *   Basic rate     income £200 to £800: 12% / 16% / 19% of income
 *   Basic plus     income £800.01 to £3,000: basic on the first £800, then 9% / 12% / 15% of the rest
 *   Over £3,000    the service stops at £3,000; a court can order more
 * Other children living with the paying parent cut the income counted by 11% / 14% / 16%.
 * Shared care cuts each child's amount by 1/7 (52-103 nights), 2/7 (104-155), 3/7 (156-174),
 * or by half plus £7 a child (175 nights or more).
 *
 * This is an estimate. The official calculator at gov.uk/calculate-child-maintenance is the one that counts.
 */
(function () {
  var form = document.getElementById("cm-form");
  if (!form) return;

  var pct = {
    reduced: [0.17, 0.25, 0.31],
    basic:   [0.12, 0.16, 0.19],
    plus:    [0.09, 0.12, 0.15]
  };
  var otherKidsCut = [0, 0.11, 0.14, 0.16];
  var shared = { none: 0, a: 1 / 7, b: 2 / 7, c: 3 / 7, d: 0.5 };

  function gbp(n) {
    return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function idx(n) { return Math.min(Math.max(n, 1), 3) - 1; }

  function calculate(v) {
    var steps = [];
    var warn = null;
    var weekly = v.income;
    if (v.period === "year") weekly = v.income / 52;
    if (v.period === "month") weekly = v.income * 12 / 52;
    steps.push("Gross income counted: " + gbp(weekly) + " a week.");

    if (v.otherKids > 0) {
      var cut = otherKidsCut[Math.min(v.otherKids, 3)];
      weekly = weekly * (1 - cut);
      steps.push(v.otherKids + " other " + (v.otherKids === 1 ? "child" : "children") + " at home cut the income counted by " + Math.round(cut * 100) + "% to " + gbp(weekly) + ".");
    }

    var total;
    var k = idx(v.kids);

    if (v.benefits) {
      total = 7;
      steps.push("On a qualifying benefit: flat rate of £7 a week in total.");
    } else if (weekly < 7) {
      total = 0;
      steps.push("Income under £7 a week: nil rate.");
    } else if (weekly <= 100) {
      total = 7;
      steps.push("Income £7 to £100: flat rate of £7 a week in total.");
    } else if (weekly < 200) {
      total = 7 + (weekly - 100) * pct.reduced[k];
      steps.push("Reduced rate: £7 plus " + Math.round(pct.reduced[k] * 100) + "% of the " + gbp(weekly - 100) + " over £100.");
    } else {
      var capped = weekly;
      if (capped > 3000) {
        capped = 3000;
        warn = "Income over £3,000 a week. The service stops counting at £3,000; a court can order more on top.";
        steps.push("Counted at the £3,000 cap.");
      }
      if (capped <= 800) {
        total = capped * pct.basic[k];
        steps.push("Basic rate: " + Math.round(pct.basic[k] * 100) + "% of " + gbp(capped) + ".");
      } else {
        var base = 800 * pct.basic[k];
        var extra = (capped - 800) * pct.plus[k];
        total = base + extra;
        steps.push("Basic rate on the first £800: " + Math.round(pct.basic[k] * 100) + "% = " + gbp(base) + ".");
        steps.push("Then " + Math.round(pct.plus[k] * 100) + "% of the " + gbp(capped - 800) + " above £800 = " + gbp(extra) + ".");
      }
    }

    var perChild = total / v.kids;
    if (v.shared !== "none" && total > 7) {
      var frac = shared[v.shared];
      var before = total;
      perChild = perChild * (1 - frac);
      if (v.shared === "d") perChild = Math.max(perChild - 7, 0);
      total = perChild * v.kids;
      steps.push("Shared care takes " + (v.shared === "d" ? "half, then £7 a child," : (frac === 1 / 7 ? "one seventh" : frac === 2 / 7 ? "two sevenths" : "three sevenths")) + " off: " + gbp(before) + " becomes " + gbp(total) + ".");
    } else if (v.shared !== "none") {
      steps.push("Shared care does not reduce a flat or nil rate.");
    }

    return { weekly: total, monthly: total * 52 / 12, yearly: total * 52, perChild: total / v.kids, steps: steps, warn: warn };
  }

  function read() {
    return {
      income: parseFloat(form.income.value) || 0,
      period: form.period.value,
      kids: parseInt(form.kids.value, 10) || 1,
      otherKids: parseInt(form.otherkids.value, 10) || 0,
      shared: form.shared.value,
      benefits: form.benefits.checked
    };
  }

  function show() {
    var r = calculate(read());
    document.getElementById("cm-weekly").textContent = gbp(r.weekly);
    document.getElementById("cm-monthly").textContent = gbp(r.monthly);
    document.getElementById("cm-yearly").textContent = gbp(r.yearly);
    document.getElementById("cm-perchild").textContent = gbp(r.perChild);
    var ol = document.getElementById("cm-steps");
    ol.innerHTML = "";
    r.steps.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ol.appendChild(li); });
    var w = document.getElementById("cm-warn");
    w.textContent = r.warn || "";
    w.hidden = !r.warn;
  }

  form.addEventListener("input", show);
  form.addEventListener("submit", function (e) { e.preventDefault(); show(); });
  show();

  // Expose for tests in the console.
  window.MATH_calculateMaintenance = calculate;
})();

/* First-year cost planner: a table that adds up. */
(function () {
  var t = document.getElementById("planner");
  if (!t) return;
  function sum() {
    var total = 0;
    t.querySelectorAll("input[type=number]").forEach(function (i) { total += parseFloat(i.value) || 0; });
    document.getElementById("planner-total").textContent = "£" + total.toLocaleString("en-GB");
    document.getElementById("planner-weekly").textContent = "£" + Math.round(total / 52).toLocaleString("en-GB") + " a week";
  }
  t.addEventListener("input", sum);
  sum();
})();
