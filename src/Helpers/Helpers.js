export const selectOptionsMap = (data, val, label) => {
  let options = [];
  if (data)
    data?.map((obj) => {
      options.push({
        value: obj[val],
        label: obj[label],
      });
    });
  return options;
};

export const idsStatusToArray = (data, val) => {
  let options = [];
  if (data)
    data?.map((obj) => {
      let dataToPush = {
        id: obj[val],
        status: 1,
      };
      options.push(dataToPush);
    });
  return options;
};

export const idsToArray = (data, val) => {
  let options = [];
  if (data)
    data?.map((obj) => {
      options.push(obj[val]);
    });
  return options;
};

export const getValue = (value) =>
  typeof value === "string" ? value.toUpperCase() : value;

export function filterPlainArray(array, filters) {
  const filterKeys = Object.keys(filters);
  return array?.filter((item) => {
    return filterKeys?.every((key) => {
      if (!filters[key]?.length) return true;
      return filters[key]?.find(
        (filter) => getValue(filter) === getValue(item[key])
      );
    });
  });
}
export const formatFileSize = (sizeInBytes) => {
  const units = ["B", "KB", "MB", "GB"];
  let size = sizeInBytes;
  let i = 0;

  while (size > 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toFixed(2)} ${units[i - 1]}`;
};

export const getBase64FromFile = async (imageFiles) => {
  let FileArray = [];
  let temp;
  for (let i = 0; i < imageFiles.length; i++) {
    temp = await convertToBase64(imageFiles[i]);
    let Fjson = {
      fileName: imageFiles[i].name,
      fileContent: temp,
      fileExtension: imageFiles[i].type,
      fileSize: imageFiles[i].size.toString(),
    };
    FileArray.push(Fjson);
  }
  return FileArray;
};
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64String = reader.result;
      resolve(base64String);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};
export const generateRowsForDataGridForIDandStatus = (data, val) => {
  let rowsArrays = data?.map((object) => ({
    ...object,
    id: object[val],
    statusName: object?.status === 1 ? "Active" : "Inactive",
  }));

  return rowsArrays;
};

export const generateRowsForDataGridForIDandIsActive = (data, val) => {
  let rowsArrays = data?.map((object) => ({
    ...object,
    id: object[val],
    statusName: object?.isActive === 1 ? "Active" : "Inactive",
  }));

  return rowsArrays;
};
