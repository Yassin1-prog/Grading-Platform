function validateExcelStructure(data, courseName, term, numberOfGrades) {
  // Check basic structure
  if (!data || data.length < 4) {
    return "Invalid Excel structure: Not enough rows";
  }

  // Check course name and term in header
  const header = data[0][0];
  const period = data[3][3];

  if (!header.includes(courseName) || !period.includes(term)) {
    return "Course name or term in file does not match provided values";
  }

  // Check weights row exists
  if (data[1].length < 8 + parseInt(numberOfGrades)) {
    return "Invalid weights row in Excel file, number of grades provided does not match the number in the file";
  }

  // Check column headers
  const expectedHeaders = [
    "Αριθμός Μητρώου",
    "Ονοματεπώνυμο",
    "Ακαδημαϊκό E-mail",
    "Περίοδος δήλωσης",
    "Τμήμα Τάξης",
    "Κλίμακα βαθμολόγησης",
    "Βαθμολογία",
  ];

  //const actualHeaders = data[3].slice(0, 7); CHANGEEEEEED
  const actualHeaders = data[2].slice(0, 7);
  for (let i = 0; i < expectedHeaders.length; i++) {
    if (actualHeaders[i] !== expectedHeaders[i]) {
      return `Invalid column header at position ${i + 1}: expected "${
        expectedHeaders[i]
      }", found "${actualHeaders[i]}"`;
    }
  }

  return null;
}

module.exports = {
  validateExcelStructure,
};
