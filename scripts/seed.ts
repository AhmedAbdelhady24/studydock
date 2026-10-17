import fs from "fs";
import path from "path";
import { parsePlanImportCsv, parseCourseTargetsCsv } from "../src/lib/csv-parser";
import { executePlanImport } from "../src/lib/importer";
import { closeConnection } from "../src/db";

async function main() {
  console.log("🌱 Starting StudyDock Database Seed...");

  const planPath = path.resolve(__dirname, "../data/import/plan_import.csv");
  const coursesPath = path.resolve(__dirname, "../data/import/course_targets.csv");

  if (!fs.existsSync(planPath)) {
    console.error(`❌ Plan file not found at: ${planPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(coursesPath)) {
    console.error(`❌ Course targets file not found at: ${coursesPath}`);
    process.exit(1);
  }

  console.log("Reading CSV fixtures...");
  const planCsv = fs.readFileSync(planPath, "utf-8");
  const coursesCsv = fs.readFileSync(coursesPath, "utf-8");

  console.log("Validating CSV fixtures against strict schemas...");
  const planResult = parsePlanImportCsv(planCsv);
  if (!planResult.success) {
    console.error("❌ Plan CSV parsing failed:", planResult.errors);
    process.exit(1);
  }

  const coursesResult = parseCourseTargetsCsv(coursesCsv);
  if (!coursesResult.success) {
    console.error("❌ Course Targets CSV parsing failed:", coursesResult.errors);
    process.exit(1);
  }

  console.log(`✓ Parsed ${planResult.data.length} plan tasks across 33 weeks.`);
  console.log(`✓ Parsed ${coursesResult.data.length} course targets.`);

  console.log("Executing transactional database import...");
  const result = await executePlanImport(planResult.data, coursesResult.data);

  console.log(`✅ Seed Complete! ${result.message}`);
  await closeConnection();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("❌ Seed error:", err);
  await closeConnection();
  process.exit(1);
});
