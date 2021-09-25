export const getDataTransfert = (e: InputEvent) => {
  const dataTransfer = e.dataTransfer as DataTransfer;
  const data = dataTransfer.getData("text/plain");
  return data;
};
