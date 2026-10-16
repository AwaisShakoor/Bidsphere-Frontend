export type ItemImage = {
  id: string;
  url: string;
  itemId: string;
};

export type UploadItemImagesResponse = {
  message: string;
  images: ItemImage[];
};

export type GetItemImagesResponse = {
  message: string;
  images: ItemImage[];
};

export type DeleteItemImageResponse = {
  message: string;
};
