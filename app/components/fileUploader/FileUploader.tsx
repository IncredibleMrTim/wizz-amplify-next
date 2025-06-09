"use client";
import { useState } from "react";
import { FileUploader as AmplifyFileUploader } from "@aws-amplify/ui-react-storage";
import { Schema } from "amplify/data/resource";
import { FiX } from "react-icons/fi";

interface FileUploaderProps {
  product: Schema["Product"]["type"];
  updateProductImages: (args: { key: string; shouldDelete?: boolean }) => void;
}

export const FileUploader = ({
  product,
  updateProductImages,
}: FileUploaderProps) => {
  return (
    <div className="flex justify-between gap-4 w-full">
      {/* TODO: Make this its own component */}
      <AmplifyFileUploader
        acceptedFileTypes={["image/*"]}
        path={`${process.env.AWS_S3_PRODUCT_IMAGE_PATH!}`}
        maxFileCount={10}
        isResumable
        defaultFiles={product?.images?.map((img) => ({
          key: img?.url?.replace("public/", "") as string,
        }))}
        maxFileSize={2000000}
        components={{
          Container({ children }) {
            return <div className="flex flex-row gap-2 w-full">{children}</div>;
          },
          DropZone({ children }) {
            return (
              <div className="flex flex-col gap-2 w-1/2">
                <div className="flex flex-col gap-4 justify-center items-center border-2 border-dashed border-gray-300 rounded-md h-64 bg-white">
                  {children}
                  <p className="text-sm text-gray-500">
                    Drag and drop files here, or click to select files.
                  </p>
                </div>
              </div>
            );
          },
          FileListHeader() {
            return null;
          },
          FileList({}) {
            return (
              <div className="flex flex-col gap-2 w-1/2">
                <div className="flex flex-wrap gap-2 border-1 border-gray-300 bg-white h-64 p-4 overflow-scroll w-full">
                  {product?.images &&
                    (product?.images ?? [])?.map((file, index) => {
                      return (
                        <div
                          key={`${file?.url}-${index}`}
                          className="flex flex-col bg-white h-32 w-1/5  justify-center items-center border-1 border-gray-200 p-2 relative"
                        >
                          <img
                            src={`${process.env.AWS_S3_PRODUCT_IMAGE_URL}${file?.url}`}
                            alt={`${product?.name} product image`}
                            className="object-cover"
                          />

                          <div
                            className="ml-2 text-gray-300 hover:text-gray-400 !rounded-full !border-1 !absolute !-top-2 !-right-2 bg-white p-1 cursor-pointer"
                            onClick={() => {
                              // Remove the image from the product images

                              updateProductImages({
                                key: file?.url || "",
                                shouldDelete: true,
                              });
                            }}
                          >
                            <FiX />
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
          if (!key) return;

          updateProductImages({ key });

          //   setNewProduct((prev) => {
          //     // ensure there are no duplicates
          //     if (
          //       prev?.images?.find((img) => {
          //         return img?.url === key;
          //       })
          //     ) {
          //       return prev;
          //     }

          //     return {
          //       ...prev,
          //       images: [...(prev?.images || []), { url: key }],
          //     } as unknown as Schema["Product"]["type"];
          //   }
          // );
        }}
      />
    </div>
  );
};
