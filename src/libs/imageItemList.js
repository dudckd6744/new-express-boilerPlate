export const ItemList = (imageListData) => {
  return imageListData.map((element) => {
    const imageData = [
      element.imageData_01,
      element.imageData_02,
      element.imageData_03,
      element.imageData_04,
      element.imageData_05,
    ];
    // NOTE: imageData_0~5의 컬럼중에 null 값이 있으면 제거 후에 배열을 반환 해준다.
    //       프론트에서 imageList 배열에서 null 값인 데이터를 처리해준다면 없어도 되는 로직
    const newImageData = imageData.filter(Boolean);

    const imageList = newImageData.map((image, i) => {
      if (image != null) {
        const result = image.split(',');
        return {
          imageId: result[0],
          imageURL: result[1],
        };
      }
    });

    return {
      taskId: element.taskId,
      name: element.name,
      userMessage: element.userMessage,
      tagList: [element.tagList],
      representativeItemImage: element.representativeItemImage,
      imageList: imageList,
    };
  });
};
