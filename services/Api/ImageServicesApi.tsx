import api from "@/lib/api";
import type {
  DeleteItemImageResponse,
  GetItemImagesResponse,
  UploadItemImagesResponse,
} from "@/services/types/ImageServicesTypes";

export async function getItemImages(itemId: string) {
  const { data } = await api.get<GetItemImagesResponse>(
    `/api/items/${itemId}/images`,
  );
  return data.images;
}

export async function uploadItemImages(itemId: string, files: File[]) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const { data } = await api.post<UploadItemImagesResponse>(
    `/api/items/${itemId}/images`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return data.images;
}

export async function deleteItemImage(itemId: string, imageId: string) {
  const { data } = await api.delete<DeleteItemImageResponse>(
    `/api/items/${itemId}/images/${imageId}`,
  );
  return data;
}
