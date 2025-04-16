function validateExcelStructure(data, courseName, term) {
  // Check basic structure
  if (!data || data.length < 4) {
    return "Invalid Excel structure: Not enough rows";
  }

  // Check course name and term in header
  const header = data[0][0];
  if (!header.includes(courseName) || !header.includes(term)) {
    return "Course name or term in file does not match provided values";
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
