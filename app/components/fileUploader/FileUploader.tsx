"use client";
import { useRef } from "react";
import { FileUploader as AmplifyFileUploader } from "@aws-amplify/ui-react-storage";
import { Schema } from "amplify/data/resource";
import { FiX } from "react-icons/fi";
import { Flex } from "@radix-ui/themes";

interface FileUploaderProps {
  product: Schema["Product"]["type"];
  imagesRef?: React.RefObject<Schema["Product"]["type"]["images"]>;
  updateProductImages: (product: Schema["Product"]["type"]["images"]) => void;
  updateProductImageOrder: (key: string, order: number) => void;
}

export const FileUploader = ({
  product,
  updateProductImages,
  updateProductImageOrder,
  imagesRef,
}: FileUploaderProps) => {
  const dragKey = useRef<string | undefined>(undefined);

  return (
    <div className="flex justify-between gap-4 w-full">
      <AmplifyFileUploader
        acceptedFileTypes={["image/*"]}
        path={`${process.env.AWS_S3_PRODUCT_IMAGE_PATH!}`}
        maxFileCount={20}
        processFile={(file) => {
          // Process the file if needed before uploading
          return file;
        }}
        isResumable
        maxFileSize={2000000}
        components={{
          Container({ children }) {
            return <div className="flex flex-row gap-2 w-full">{children}</div>;
          },
          DropZone({ children, inDropZone, ...rest }) {
            return (
              <Flex className="flex flex-col gap-2 w-1/2" {...rest}>
                <div className="flex flex-col gap-4 justify-center items-center border-2 border-dashed border-gray-300 rounded-md h-64 bg-white">
                  {children}
                  <p className="text-sm text-gray-500">
                    Drag and drop files here, or click to select files.
                  </p>
                </div>
              </Flex>
            );
          },
          FileListHeader() {
            return null;
          },
          FileList({}) {
            return (
              <div className="flex flex-col gap-2 w-1/2">
                <div className="flex flex-wrap border-1 border-gray-300 bg-white h-64 p-2 overflow-scroll w-full">
                  {product?.images &&
                    [...product.images]
                      ?.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
                      ?.map((file, index) => {
                        return (
                          <div
                            key={file?.url}
                            className="flex flex-col bg-white w-1/5 items-center p-2"
                          >
                            <div
                              key={file?.url}
                              className="flex border-1 border-gray-200 h-32 p-2 relative justify-center items-center"
                              draggable
                              onDragStart={(e) => {
                                dragKey.current = file?.url;
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                              }}
                              onDrop={(e) => {
                                if (!file?.url) return;

                                updateProductImageOrder(
                                  dragKey.current!,
                                  index
                                );
                              }}
                            >
                              <img
                                src={`${process.env.AWS_S3_PRODUCT_IMAGE_URL}${file?.url}`}
                                alt={`${product?.name} product image`}
                                className="h-full cursor-move"
                              />

                              <div
                                className="ml-2 text-gray-300 hover:text-gray-400 !rounded-full !border-1 !absolute !-top-2 !-right-2 bg-white p-1 cursor-pointer"
                                onClick={() => {
                                  // Remove the image from the product images

                                  updateProductImages(
                                    Array.isArray(product?.images)
                                      ? product?.images?.filter(
                                          (img) => img?.url !== file?.url
                                        ) || []
                                      : ([] as Schema["Product"]["type"]["images"])
                                  );
                                }}
                              >
                                <FiX />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>
            );
          },
        }}
        onUploadSuccess={({ key }) => {
          if (key) {
            let newImages = [...(imagesRef?.current || [])];

            if (!newImages.find((img) => img?.url === key)) {
              newImages = [...newImages, { url: key, order: newImages.length }];
              updateProductImages(newImages);
            }
          }
        }}
      />
    </div>
  );
};
