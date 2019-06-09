const readFile = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve({ name: file.name, content: event.target.result });
    };
    reader.onerror = err => {
      reader.abort();
      reject(err);
    };
    reader.readAsBinaryString(file);
  });
};

export default readFile;
