// Master Data Array
const data = [
  [20, 78, 83, 51],
  [21, 45, 36, 32],
  [22, 1, 68, 89],
  [23, 15, 48, 84],
  [24, 81, 38, 54],
  [25, 5, 6, 95],
  [26, 30, 59, 46],
  [27, 2, 62, 94],
  [14, 57, 87, 74],
  [28, 4, 79, 73],
  [29, 72, 34, 80],
  [31, 55, 69, 61],
  [33, 66, 76, 39],
  [71, 91, 63, 88],
  [92, 75, 56, 9],
  [12, 64, 86, 10],
  [82, 3, 43, 35],
  [16, 93, 53, 98],
  [96, 11, 44, 65],
  [42, 99, 97, 8],
  [19, 70, 58, 0],
  [17, 49, 67, 37],
  [18, 7, 52, 13],
  [90, 40, 47, 77],
  [85, 41, 50, 60],
  [21, 20, 23, 97],
];

// Expose globally for browser debugging
window.lotoData = data;

/**
 * Calculates the reverse of a two-digit number.
 * e.g., 35 -> 53, 08 -> 80, 21 -> 12, 14 -> 41
 */
function getReverseNumber(val) {
  const num = parseInt(val, 10);
  if (isNaN(num)) return null;
  const str = String(num).padStart(2, "0");
  const revStr = str.split("").reverse().join("");
  return parseInt(revStr, 10);
}

/**
 * Formats a number to 2 digits (e.g., 8 -> "08")
 */
function formatTwoDigits(n) {
  return String(n).padStart(2, "0");
}

/**
 * Finds both the sub-array containing `num` and the sub-array containing its reverse `revNum`.
 * Returns deduplicated matching sub-arrays and all unique numbers in those arrays.
 */
function getSubArraysForNumber(num) {
  const rev = getReverseNumber(num);
  const matchedRows = [];
  const seenIndices = new Set();

  // Sub-arrays containing the number itself
  data.forEach((row, idx) => {
    if (row.includes(num)) {
      seenIndices.add(idx);
      matchedRows.push({ row, target: num });
    }
  });

  // Sub-arrays containing the reverse number
  if (rev !== null && rev !== num) {
    data.forEach((row, idx) => {
      if (row.includes(rev) && !seenIndices.has(idx)) {
        seenIndices.add(idx);
        matchedRows.push({ row, target: rev });
      }
    });
  }

  // Collect all unique numbers across these sub-arrays
  const allNumbersSet = new Set();
  matchedRows.forEach(({ row }) => {
    row.forEach((val) => allNumbersSet.add(val));
  });

  return { 
    num, 
    rev, 
    matchedRows, 
    allNumbers: Array.from(allNumbersSet) 
  };
}

/**
 * Renders a single result box for an input (e.g. M1, with value 08)
 * Contains the sub-array with the number and the sub-array with the reverse number in ONE box.
 */
function renderInputBox(badgeLabel, num, rev, matchedRows) {
  if (matchedRows.length === 0) {
    return `
      <article class="result-box">
        <div class="box-header">
          <div class="box-input-tag">
            <span class="box-badge">${badgeLabel}</span>
            <span class="box-number">${formatTwoDigits(num)}</span>
          </div>
        </div>
        <div class="notice-box">
          No sub-array found for <strong>${formatTwoDigits(num)}</strong> or its reverse in the dataset.
        </div>
      </article>
    `;
  }

  const arraysHtml = matchedRows
    .map(({ row }) => {
      const ballsHtml = row
        .map((val) => {
          const isMainMatch = val === num;
          const isRevMatch = val === rev;
          let highlightClass = "";
          if (isMainMatch) highlightClass = "highlight";
          else if (isRevMatch) highlightClass = "highlight-rev";

          return `<div class="ball ${highlightClass}" aria-label="Ball ${formatTwoDigits(val)}">${formatTwoDigits(val)}</div>`;
        })
        .join("");

      return `
        <div class="array-group">
          <div class="sub-array-row">${ballsHtml}</div>
          <div class="array-text">[ ${row.join(", ")} ]</div>
        </div>
      `;
    })
    .join("");

  return `
    <article class="result-box">
      <div class="box-header">
        <div class="box-input-tag">
          <span class="box-badge">${badgeLabel}</span>
          <span class="box-number">${formatTwoDigits(num)}</span>
        </div>
      </div>
      <div class="box-content">
        ${arraysHtml}
      </div>
    </article>
  `;
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  // All independent inputs across Set M (M1, M2, M3), Set S (S1, S2, S3), and Set J (J1, J2)
  const inputConfigs = [
    { id: "m1", label: "M1" },
    { id: "m2", label: "M2" },
    { id: "m3", label: "M3" },
    { id: "s1", label: "S1" },
    { id: "s2", fallbackId: "s5", label: "S2" },
    { id: "s3", fallbackId: "s6", label: "S3" },
    { id: "j1", label: "J1" },
    { id: "j2", label: "J2" },
  ];

  const inputs = inputConfigs.map((cfg) => {
    let el = document.getElementById(cfg.id);
    if (!el && cfg.fallbackId) {
      el = document.getElementById(cfg.fallbackId);
    }
    return { ...cfg, el };
  }).filter((item) => item.el !== null);

  const triageBtn = document.getElementById("triageBtn");
  const clearBtn = document.getElementById("clearBtn");
  const resultsContainer = document.getElementById("results");
  const bottomActionWrapper = document.getElementById("bottomActionWrapper");
  const selectedReverseBtn = document.getElementById("selectedReverseBtn");
  const selectedReverseResults = document.getElementById("selectedReverseResults");

  // Cache of latest triage boxes
  let currentBoxData = [];

  // Setup each independent input
  inputs.forEach((item, index) => {
    const input = item.el;

    // Digits only, strictly independent
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");

      // Auto-advance focus to next input when 2 digits are entered
      if (input.value.length >= 2 && index < inputs.length - 1) {
        inputs[index + 1].el.focus();
        inputs[index + 1].el.select();
      }
    });

    // Backspace navigation & Enter to submit
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value.length === 0 && index > 0) {
        inputs[index - 1].el.focus();
      } else if (e.key === "Enter") {
        if (document.activeElement && typeof document.activeElement.blur === "function") {
          document.activeElement.blur();
        }
        runTriage();
      }
    });

    // Select text on focus for easy overwrite
    input.addEventListener("focus", () => {
      input.select();
    });
  });

  // Triage button click
  if (triageBtn) {
    triageBtn.addEventListener("click", () => {
      // Dismiss mobile keyboard for optimal view
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
      runTriage();
    });
  }

  // Clear button click
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
      inputs.forEach((item) => (item.el.value = ""));
      resultsContainer.innerHTML = "";
      if (bottomActionWrapper) bottomActionWrapper.style.display = "none";
      if (selectedReverseResults) {
        selectedReverseResults.innerHTML = "";
        selectedReverseResults.style.display = "none";
      }
      currentBoxData = [];
      if (inputs[0]) inputs[0].el.focus();
    });
  }

  // Selected Reverse button click
  if (selectedReverseBtn) {
    selectedReverseBtn.addEventListener("click", () => {
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
      runSelectedReverse();
    });
  }

  function runTriage() {
    // Hide previous Selected Reverse results when re-triaging
    if (selectedReverseResults) {
      selectedReverseResults.innerHTML = "";
      selectedReverseResults.style.display = "none";
    }

    // Find all inputs with a value
    const filled = inputs.filter((item) => item.el.value.trim().length > 0);

    if (filled.length === 0) {
      resultsContainer.innerHTML = `
        <div class="notice-box">
          Please enter a 2-digit number in at least one input field.
        </div>
      `;
      if (bottomActionWrapper) bottomActionWrapper.style.display = "none";
      currentBoxData = [];
      if (inputs[0]) inputs[0].el.focus();
      return;
    }

    // Process boxes data
    currentBoxData = filled.map((item) => {
      const num = parseInt(item.el.value.trim(), 10);
      const subData = getSubArraysForNumber(num);
      return {
        id: item.id,
        label: item.label,
        num,
        rev: subData.rev,
        matchedRows: subData.matchedRows,
        allNumbers: subData.allNumbers,
      };
    });

    // Render result boxes
    const boxesHtml = currentBoxData
      .map((box) => renderInputBox(box.label, box.num, box.rev, box.matchedRows))
      .join("");

    resultsContainer.innerHTML = `
      <div class="results-grid">
        ${boxesHtml}
      </div>
    `;

    // Reveal the "Selected Reverse" button at the bottom of the results
    if (bottomActionWrapper) {
      bottomActionWrapper.style.display = "flex";
    }

    // Smoothly ensure results are visible on mobile
    resultsContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /**
   * Selected Reverse Logic:
   * Rolls over each filled input box against all subsequent filled input boxes.
   * For every number X in Box A, checks if its reverse rev(X) is found in Box B.
   * When found, returns the 4-digit reverse combo (e.g. 0880, 4224, etc.).
   */
  function runSelectedReverse() {
    if (!selectedReverseResults) return;

    if (currentBoxData.length < 2) {
      selectedReverseResults.style.display = "flex";
      selectedReverseResults.innerHTML = `
        <div class="sr-card">
          <div class="sr-header">
            <h3 class="sr-title">Selected Reverse</h3>
            <p class="sr-subtitle">Please enter numbers in at least 2 inputs to compare boxes.</p>
          </div>
        </div>
      `;
      selectedReverseResults.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    const pairResults = [];
    const uniqueCombosSet = new Set();

    // Rollover comparison: Box i vs all Box j (j > i)
    for (let i = 0; i < currentBoxData.length; i++) {
      const boxA = currentBoxData[i];

      for (let j = i + 1; j < currentBoxData.length; j++) {
        const boxB = currentBoxData[j];
        const matchesBetween = [];
        const seenInThisPair = new Set();

        // For each number in Box A, check if its reverse is in Box B
        boxA.allNumbers.forEach((numA) => {
          const revA = getReverseNumber(numA);
          if (revA !== null && boxB.allNumbers.includes(revA)) {
            const sA = formatTwoDigits(numA);
            const sRev = formatTwoDigits(revA);
            const combo = `${sA}${sRev}`;

            if (!seenInThisPair.has(combo)) {
              seenInThisPair.add(combo);
              uniqueCombosSet.add(combo);
              matchesBetween.push({
                numA,
                revA,
                sA,
                sRev,
                combo,
              });
            }
          }
        });

        if (matchesBetween.length > 0) {
          pairResults.push({
            boxA,
            boxB,
            matches: matchesBetween,
          });
        }
      }
    }

    const uniqueCombos = Array.from(uniqueCombosSet).sort();

    let outputHtml = "";

    if (pairResults.length === 0) {
      outputHtml = `
        <div class="sr-card">
          <div class="sr-header">
            <h3 class="sr-title">Selected Reverse</h3>
            <p class="sr-subtitle">No reverse combinations found across the filled boxes.</p>
          </div>
          <div class="sr-empty">
            None of the numbers in the displayed boxes had their reverse in another box.
          </div>
        </div>
      `;
    } else {
      // Top showcase with large 4-digit combos
      const pillsHtml = uniqueCombos
        .map((combo) => `<div class="sr-combo-pill" aria-label="Combination ${combo}">${combo}</div>`)
        .join("");

      // Detailed pairwise breakdowns
      const pairsHtml = pairResults
        .map(({ boxA, boxB, matches }) => {
          const chipsHtml = matches
            .map((m) => `
              <div class="sr-match-chip">
                <div class="sr-chip-nums">
                  <span class="sr-chip-val">${m.sA}</span>
                  <span class="sr-arrow">⇄</span>
                  <span class="sr-chip-val">${m.sRev}</span>
                </div>
                <span class="sr-chip-combo">${m.combo}</span>
              </div>
            `)
            .join("");

          return `
            <div class="sr-pair-card">
              <div class="sr-pair-header">
                <span class="sr-pair-tag">${boxA.label} (${formatTwoDigits(boxA.num)})</span>
                <span class="sr-arrow">⟷</span>
                <span class="sr-pair-tag">${boxB.label} (${formatTwoDigits(boxB.num)})</span>
              </div>
              <div class="sr-items-grid">
                ${chipsHtml}
              </div>
            </div>
          `;
        })
        .join("");

      outputHtml = `
        <div class="sr-card">
          <div class="sr-header">
            <h3 class="sr-title">Selected Reverse Results</h3>
            <p class="sr-subtitle">${uniqueCombos.length} unique 4-digit reverse combinations found across boxes</p>
          </div>

          <div class="sr-combos-showcase">
            ${pillsHtml}
          </div>

          <div class="sr-matches-list">
            ${pairsHtml}
          </div>
        </div>
      `;
    }

    selectedReverseResults.innerHTML = outputHtml;
    selectedReverseResults.style.display = "flex";
    selectedReverseResults.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Focus first input initially
  if (inputs[0]) inputs[0].el.focus();
});
