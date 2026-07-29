// generateCSVData.js
export const generateCSVData = (organizedData, reportForm) => {
    let csvData = [];
    const headers = [];
    debugger
  
    // Generate headers based on dimensions
    if (reportForm) {
      const dimensions = reportForm.dimensions;
      for (let key in dimensions) {
        headers.push(dimensions[key]);
      }
      headers.push("Student Data"); 
    }
  
   
    csvData.push(headers);
  
    
    const flattenData = (data, currentKeys = []) => {
      if (Array.isArray(data)) {
        data.forEach((student) => {
          const row = [...currentKeys, JSON.stringify(student)];
          csvData.push(row);
        });
      } else {
        for (let key in data) {
          flattenData(data[key], [...currentKeys, key]);
        }
      }
    };
  
    // Flatten the organized data
    flattenData(organizedData);
  
    return csvData;
  };
  