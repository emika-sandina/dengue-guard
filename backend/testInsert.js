import { insertReportCases } from "./src/services/reportCases.service.js";
import fs from "fs";

async function testInsert() {
  const testData = {
    reportingFor: "Myself",
    symptoms: ["High Fever", "Headache"],
    doctorStatus: "Yes",
    dengueDiagnosis: "Yes",
    mohArea: "Colombo",
    location: "123 Main St, Colombo",
    symptomsStartDate: "2024-02-28",
  };

  try {
    console.log("Testing insertReportCases with data:", testData);
    const result = await insertReportCases(testData);
    console.log("Insert Success:", result);
    fs.writeFileSync("test_insert_result.json", JSON.stringify({ success: true, result }, null, 2));
  } catch (error) {
    console.error("Insert Failed:", error);
    fs.writeFileSync("test_insert_result.json", JSON.stringify({ success: false, error: error.message, fullError: error }, null, 2));
  }
  process.exit(0);
}

testInsert();
