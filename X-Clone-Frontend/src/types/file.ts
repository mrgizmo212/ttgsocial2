export type PostImageData = {
  src: string;
  alt: string;
  type?: string;
};

export type FilesWithId = (File & {
  id: string;
})[];
