import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function audit() {
  console.log("🔍 Running Glyphtiq Symbol Audit Validation Suite...");

  const rawJson = await readFile(path.join(ROOT, "lib", "symbols", "generated.json"), "utf8");
  const entries = JSON.parse(rawJson);

  let errors = 0;
  const seenSlugs = new Set();
  const seenCodePoints = new Set();

  for (const entry of entries) {
    // 1. Slug check
    if (!entry.slug || typeof entry.slug !== "string") {
      console.error(`❌ Empty slug for codepoint ${entry.codePoint}`);
      errors++;
    } else if (seenSlugs.has(entry.slug)) {
      console.error(`❌ Duplicate slug: ${entry.slug}`);
      errors++;
    } else {
      seenSlugs.add(entry.slug);
    }

    // 2. Codepoint check
    if (!entry.codePoint) {
      console.error(`❌ Missing codePoint for ${entry.slug}`);
      errors++;
    } else if (seenCodePoints.has(entry.codePoint)) {
      console.error(`❌ Duplicate codePoint: ${entry.codePoint}`);
      errors++;
    } else {
      seenCodePoints.add(entry.codePoint);
    }

    // 3. Name & Character check
    if (!entry.name) {
      console.error(`❌ Missing name for ${entry.slug}`);
      errors++;
    }
    if (!entry.char) {
      console.error(`❌ Missing char for ${entry.slug}`);
      errors++;
    }

    // 4. Tags check
    if (!Array.isArray(entry.tags)) {
      console.error(`❌ Missing tags array for ${entry.slug}`);
      errors++;
    }
  }

  if (errors > 0) {
    console.error(`\n❌ Audit Failed with ${errors} error(s)!`);
    process.exit(1);
  } else {
    console.log(`\n✅ Audit Passed Cleanly! (${entries.length} symbols verified with zero errors)`);
  }
}

audit().catch((err) => {
  console.error(err);
  process.exit(1);
});
