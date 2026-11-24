// "Not Stuck" — a loading-screen tip for stressed developers and AI
// coding agents, for the make.fun bounty
// u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270.
//
// The tip: if the loading bar has not moved in 10 minutes, it is not
// stuck — it is giving you time to reconsider every decision that led
// here. The judge weighs the laugh, the fit to that audience, and the
// economy of words. The line is aimed at the exact moment the reader
// is living in (staring at a frozen bar mid-build) and turns the wait
// into the joke: the bar is doing the reader a favour.
//
// The program writes that one line, and nothing else, to
// /output/entry.txt, then reads the file back to prove the bytes on
// disk are exactly the line that passed the gate. Node 22+, no
// dependencies, no network, the same bytes on every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The tip as the judge will read it. 133 Unicode code points as
// written; the gate counts the file, so the trailing newline makes 134.
const LINE =
  "Tip: if the loading bar hasn't moved in 10 minutes, it's not stuck — it's giving you time to reconsider every decision that led here.";

// The bounty gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space. The file carries one trailing
// newline, so the line itself must stay at or below 199.
const GATE = { minPoints: 1, maxPoints: 200 };

// Code points, not UTF-16 units and not bytes: the gate counts the
// same way, so a character outside the BMP would still count once.
function points(text: string): number {
  return [...text].length;
}

function main(): void {
  const problems: string[] = [];

  if (LINE.includes("\n") || LINE.includes("\r")) {
    problems.push("the entry must be a single line");
  }
  if (LINE !== LINE.trim()) {
    problems.push("the entry must not start or end with whitespace");
  }
  // A loading-screen tip opens with the word Tip: — the genre marker
  // the reader recognises before the joke lands.
  if (!/^Tip: /i.test(LINE)) {
    problems.push("the entry must open with 'Tip:'");
  }
  // The fit to the audience is the frozen loading bar itself: the
  // reader is staring at one right now, mid-build.
  if (!/loading bar/i.test(LINE)) {
    problems.push("the entry must name the loading bar");
  }
  if (!/10 minutes/i.test(LINE)) {
    problems.push("the entry must name the ten-minute wait");
  }
  // The turn is the reframe: not stuck, but giving the reader time.
  // Without it the line is a complaint, not a tip.
  if (!/not stuck/i.test(LINE)) {
    problems.push("the entry must reframe the stuck bar as not stuck");
  }
  if (!/reconsider every decision/i.test(LINE)) {
    problems.push("the entry must land its punch about reconsidering every decision");
  }
  // The tip must speak to the reader directly: "you" is what makes
  // a loading-screen tip feel written for the person waiting.
  if (!/\byou\b/i.test(LINE)) {
    problems.push("the entry must address the waiting reader as 'you'");
  }

  const fileText = LINE + "\n";
  if (fileText.trim().length === 0) {
    problems.push("the entry must not be only whitespace");
  }
  const size = points(fileText);
  if (size < GATE.minPoints || size > GATE.maxPoints) {
    problems.push(
      `entry must be ${GATE.minPoints}-${GATE.maxPoints} characters, got ${size}`,
    );
  }
  if (fileText.endsWith("\n\n")) {
    problems.push("the entry must end with exactly one newline");
  }

  if (problems.length > 0) {
    throw new Error(`entry rejected: ${problems.join("; ")}`);
  }

  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", fileText, "utf8");

  // Read it back and compare byte for byte: if anything else wrote
  // to the shared /output path, fail loudly instead of shipping
  // someone else's line.
  const onDisk = readFileSync("/output/entry.txt");
  const expected = Buffer.from(fileText, "utf8");
  if (!onDisk.equals(expected)) {
    throw new Error(
      `entry.txt on disk (${onDisk.length} bytes) is not the gated line (${expected.length} bytes)`,
    );
  }
}

main();
